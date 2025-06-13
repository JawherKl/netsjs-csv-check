import { Injectable } from '@nestjs/common';

@Injectable()
export class CsvValidator {
    validate(csvRecord: string[]): boolean {
        if (!Array.isArray(csvRecord)) {
            return false;
        }

        // Check if all fields have values
        return csvRecord.every(field => field !== undefined && field !== null);
    }

    validateHeader(header: string[]): boolean {
        if (!Array.isArray(header) || header.length === 0) {
            return false;
        }

        // Check for duplicate headers
        const uniqueHeaders = new Set(header);
        if (uniqueHeaders.size !== header.length) {
            return false;
        }

        // Check for empty header names
        return header.every(field => field && field.trim().length > 0);
    }
}