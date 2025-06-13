import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { EnvConfig } from '../../config/env.config';

@Module({
  providers: [MinioService, EnvConfig],
  exports: [MinioService],
})
export class MinioModule {}