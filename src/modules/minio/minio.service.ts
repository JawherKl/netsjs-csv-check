import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { EnvConfig } from '../../config/env.config';
import { Readable } from 'stream';

@Injectable()
export class MinioService {
  private minioClient: Client;

  constructor(private envConfig: EnvConfig) {
    this.minioClient = new Client({
      endPoint: this.envConfig.get('MINIO_ENDPOINT') || 'localhost',
      port: this.envConfig.getNumber('MINIO_PORT') || 9000,
      useSSL: this.envConfig.getBoolean('MINIO_USE_SSL') || false,
      accessKey: this.envConfig.get('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey: this.envConfig.get('MINIO_SECRET_KEY') || 'minioadmin',
    });
  }

  async uploadFile(bucketName: string, objectName: string, file: Buffer): Promise<string> {
    await this.minioClient.putObject(bucketName, objectName, file);
    return objectName;
  }

  async getFile(bucketName: string, objectName: string): Promise<Buffer> {
    const dataStream = await this.minioClient.getObject(bucketName, objectName);
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      dataStream.on('data', (chunk) => chunks.push(chunk));
      dataStream.on('end', () => resolve(Buffer.concat(chunks)));
      dataStream.on('error', reject);
    });
  }

  async bucketExists(bucketName: string): Promise<boolean> {
    return await this.minioClient.bucketExists(bucketName);
  }

  async createBucket(bucketName: string): Promise<void> {
    await this.minioClient.makeBucket(bucketName, 'us-east-1');
  }
}