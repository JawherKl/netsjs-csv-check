import { Injectable, BadRequestException } from '@nestjs/common';
import { CsvSchema, CsvDataType } from '../../../shared/interfaces/csv-schema.interface';
import * as EmailValidator from 'email-validator';

@Injectable()
export class SchemaValidator {
  validateAgainstSchema(headers: string[], rows: string[][], schema: CsvSchema): void {
    this.validateHeaders(headers, schema);
    this.validateDelimiter(rows, schema.delimiter);
    this.validateDataTypes(rows, schema);
    this.validateRequiredFields(rows, schema);
    this.validateRowLength(rows, headers.length);
  }

  private validateHeaders(headers: string[], schema: CsvSchema): void {
    const expectedHeaders = schema.columns.map(col => col.name);
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
    
    if (missingHeaders.length > 0) {
      throw new BadRequestException(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
  }

  private validateDelimiter(rows: string[][], delimiter: string): void {
    const pattern = new RegExp(`[^${delimiter}]${delimiter}[^${delimiter}]`);
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].join(delimiter);
      if (!pattern.test(row)) {
        throw new BadRequestException(`Inconsistent delimiter usage at row ${i + 1}`);
      }
    }
  }

  private validateDataTypes(rows: string[][], schema: CsvSchema): void {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      for (let j = 0; j < schema.columns.length; j++) {
        const value = row[j];
        const column = schema.columns[j];
        
        if (!this.isValidDataType(value, column.type)) {
          throw new BadRequestException(
            `Invalid data type at row ${i + 1}, column ${column.name}. Expected ${column.type}`
          );
        }
      }
    }
  }

  private isValidDataType(value: string, type: CsvDataType): boolean {
    if (!value && value !== '0') return true; // Skip empty values (handled by required field validation)
    
    switch (type) {
      case CsvDataType.NUMBER:
        return !isNaN(Number(value));
      case CsvDataType.DATE:
        return !isNaN(Date.parse(value));
      case CsvDataType.EMAIL:
        return EmailValidator.validate(value);
      case CsvDataType.BOOLEAN:
        return ['true', 'false', '0', '1'].includes(value.toLowerCase());
      case CsvDataType.STRING:
        return true;
      default:
        return false;
    }
  }

  private validateRequiredFields(rows: string[][], schema: CsvSchema): void {
    const requiredColumns = schema.columns
      .map((col, index) => ({ index, ...col }))
      .filter(col => col.required);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      for (const column of requiredColumns) {
        if (!row[column.index] && row[column.index] !== '0') {
          throw new BadRequestException(
            `Missing required value at row ${i + 1}, column ${column.name}`
          );
        }
      }
    }
  }

  private validateRowLength(rows: string[][], expectedLength: number): void {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].length !== expectedLength) {
        throw new BadRequestException(
          `Inconsistent column count at row ${i + 1}. Expected ${expectedLength}, got ${rows[i].length}`
        );
      }
    }
  }
}