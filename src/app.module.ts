import { Module } from '@nestjs/common';
import { CsvModule } from './modules/csv/csv.module';
import { MinioModule } from './modules/minio/minio.module';
import { ValidationModule } from './modules/validation/validation.module';
import { EnvConfig } from './config/env.config';

@Module({
  imports: [CsvModule, MinioModule, ValidationModule],
  providers: [EnvConfig],
})
export class AppModule {}