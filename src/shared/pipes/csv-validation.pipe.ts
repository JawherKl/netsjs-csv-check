import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as iconv from 'iconv-lite';
import { ALLOWED_ENCODINGS } from '../constants';
import { SchemaValidator } from 'src/modules/validation/validators/schema-validator';
import { CsvDataType, CsvSchema } from '../interfaces/csv-schema.interface';
import Papa from 'papaparse';

@Injectable()
export class CsvValidationPipe implements PipeTransform {
  constructor(private schemaValidator: SchemaValidator) {}

  async transform(value: any) {
    if (!value || !value.buffer) {
      throw new BadRequestException('Invalid CSV data');
    }

    // Define schema (can be moved to configuration)
    const schema: CsvSchema = {
      delimiter: ',',
      columns: [
        { name: 'name', type: CsvDataType.STRING, required: true },
        { name: 'email', type: CsvDataType.EMAIL, required: true },
        { name: 'age', type: CsvDataType.NUMBER, required: false },
        { name: 'birthDate', type: CsvDataType.DATE, required: false },
        { name: 'active', type: CsvDataType.BOOLEAN, required: true }
      ]
    };

    const csvContent = value.buffer.toString();
    const parsedCsv = Papa.parse(csvContent, {
      delimiter: schema.delimiter,
      header: true,
      skipEmptyLines: true
    });

    if (parsedCsv.errors.length > 0) {
      throw new BadRequestException(`CSV parsing error: ${parsedCsv.errors[0].message}`);
    }

    const headers = Object.keys(parsedCsv.data[0]);
    const rows = parsedCsv.data.map(row => Object.values(row));

    this.schemaValidator.validateAgainstSchema(headers, rows, schema);

    return {
      ...value,
      parsedData: parsedCsv.data,
      headers,
      schema
    };
  }

  private async detectEncoding(buffer: Buffer): Promise<string> {
    try {
      // Try UTF-8 first
      const utf8Content = buffer.toString('utf8');
      if (this.isValidUtf8(buffer)) {
        return 'UTF-8';
      }

      // Try ASCII
      const asciiContent = buffer.toString('ascii');
      if (this.isAscii(asciiContent)) {
        return 'ASCII';
      }

      throw new BadRequestException('Unsupported file encoding');
    } catch (error) {
      throw new BadRequestException(`Encoding detection failed: ${error.message}`);
    }
  }

  private isValidUtf8(buffer: Buffer): boolean {
    try {
      iconv.decode(buffer, 'utf-8');
      return true;
    } catch {
      return false;
    }
  }

  private isAscii(content: string): boolean {
    return /^[\x00-\x7F]*$/.test(content);
  }

  private decodeCsvContent(buffer: Buffer, encoding: string): string {
    return iconv.decode(buffer, encoding);
  }

  private async validateCsvStructure(content: string): Promise<void> {
    const lines = content.split('\n');
    
    if (lines.length < 2) {
      throw new BadRequestException('CSV file must contain at least a header and one data row');
    }

    const headerColumns = lines[0].split(',').length;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const columns = line.split(',').length;
        if (columns !== headerColumns) {
          throw new BadRequestException(
            `Inconsistent number of columns at line ${i + 1}`
          );
        }
      }
    }
  }
}