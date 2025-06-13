import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { CsvValidator } from './validators/csv-validator';

@Module({
  providers: [ValidationService, CsvValidator],
  exports: [ValidationService],
})
export class ValidationModule {}