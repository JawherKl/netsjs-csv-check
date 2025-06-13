import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { MAX_FILE_SIZE, ALLOWED_FILE_EXTENSIONS, ALLOWED_MIME_TYPES } from '../constants';
import { Express } from 'express';
import * as path from 'path';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  async transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // File extension validation
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`
      );
    }

    // MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid MIME type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
      );
    }

    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      );
    }

    // Empty file validation
    if (file.size === 0) {
      throw new BadRequestException('Empty file uploaded');
    }

    return file;
  }
}