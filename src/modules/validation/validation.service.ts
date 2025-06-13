import { Injectable, BadRequestException } from '@nestjs/common';
import * as iconv from 'iconv-lite';
import { ALLOWED_ENCODINGS } from '../../shared/constants';
import { Express } from 'express';

@Injectable()
export class ValidationService {
  async validateCsvData(file: Express.Multer.File): Promise<{
    isValid: boolean;
    encoding: string;
    errors?: string[];
  }> {
    const errors: string[] = [];
    let encoding: string;

    try {
      // Detect and validate encoding
      encoding = await this.detectFileEncoding(file.buffer);
      
      // Decode content
      const content = this.decodeCsvContent(file.buffer, encoding);
      
      // Validate CSV structure
      await this.validateCsvStructure(content);

      return {
        isValid: errors.length === 0,
        encoding,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async detectFileEncoding(buffer: Buffer): Promise<string> {
    for (const encoding of ALLOWED_ENCODINGS) {
      try {
        iconv.decode(buffer, encoding);
        return encoding;
      } catch {
        continue;
      }
    }
    throw new BadRequestException('Unsupported file encoding');
  }

  private decodeCsvContent(buffer: Buffer, encoding: string): string {
    return iconv.decode(buffer, encoding);
  }

  private async validateCsvStructure(content: string): Promise<void> {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new BadRequestException('CSV file is empty');
    }

    const headerColumns = lines[0].split(',').length;

    if (headerColumns === 0) {
      throw new BadRequestException('Invalid CSV header');
    }

    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').length;
      if (columns !== headerColumns) {
        throw new BadRequestException(
          `Line ${i + 1} has ${columns} columns (expected ${headerColumns})`
        );
      }
    }
  }
}