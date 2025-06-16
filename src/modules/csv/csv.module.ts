import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { CsvService } from './csv.service';
import { MinioModule } from '../minio/minio.module';
import { ValidationModule } from '../validation/validation.module';
import { SchemaValidator } from '../validation/validators/schema-validator';
import { CsvValidationPipe } from 'src/shared/pipes/csv-validation.pipe';

@Module({
  imports: [ValidationModule, MinioModule],
  controllers: [CsvController],
  providers: [CsvService, SchemaValidator, CsvValidationPipe],
  exports: [CsvService]
})
export class CsvModule {}