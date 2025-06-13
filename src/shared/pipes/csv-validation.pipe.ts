import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as iconv from 'iconv-lite';
import { ALLOWED_ENCODINGS } from '../constants';

@Injectable()
export class CsvValidationPipe implements PipeTransform {
  async transform(value: any) {
    if (!value || !value.buffer) {
      throw new BadRequestException('Invalid CSV data');
    }

    const encoding = await this.detectEncoding(value.buffer);
    if (!ALLOWED_ENCODINGS.includes(encoding)) {
      throw new BadRequestException(
        `Invalid file encoding. Allowed encodings: ${ALLOWED_ENCODINGS.join(', ')}`
      );
    }

    // Validate CSV structure
    const csvContent = this.decodeCsvContent(value.buffer, encoding);
    await this.validateCsvStructure(csvContent);

    return {
      ...value,
      encoding,
      content: csvContent,
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