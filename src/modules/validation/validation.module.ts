import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { CsvValidator } from './validators/csv-validator';
import { SchemaValidator } from './validators/schema-validator';

@Module({
  providers: [ValidationService, CsvValidator, SchemaValidator],
  exports: [ValidationService, SchemaValidator],
})
export class ValidationModule {}