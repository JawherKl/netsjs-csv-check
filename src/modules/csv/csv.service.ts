import { Injectable, BadRequestException } from '@nestjs/common';
import { MinioService } from '../minio/minio.service';
import { BUCKET_NAME } from '../../shared/constants';
import * as iconv from 'iconv-lite';
import { Express } from 'express';

@Injectable()
export class CsvService {
  constructor(private readonly minioService: MinioService) {}

  async processCsv(file: Express.Multer.File) {
    try {
      // Check file encoding
      const encoding = await this.detectEncoding(file.buffer);
      
      // Ensure bucket exists
      const bucketExists = await this.minioService.bucketExists(BUCKET_NAME);
      if (!bucketExists) {
        await this.minioService.createBucket(BUCKET_NAME);
      }

      // Generate unique filename
      const filename = `${Date.now()}-${file.originalname}`;
      
      // Upload to MinIO
      await this.minioService.uploadFile(BUCKET_NAME, filename, file.buffer);

      return {
        message: 'File uploaded successfully',
        filename,
        encoding,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      throw new BadRequestException(`File processing failed: ${error.message}`);
    }
  }

  private async detectEncoding(buffer: Buffer): Promise<string> {
    // Simple encoding detection (UTF-8 vs ASCII)
    const isUTF8 = this.isUTF8(buffer);
    return isUTF8 ? 'UTF-8' : 'ASCII';
  }

  private isUTF8(buffer: Buffer): boolean {
    try {
      iconv.decode(buffer, 'UTF-8');
      return true;
    } catch {
      return false;
    }
  }
}