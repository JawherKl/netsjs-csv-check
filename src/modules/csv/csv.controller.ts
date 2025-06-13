import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvService } from './csv.service';
import { FileValidationPipe } from '../../shared/pipes/file-validation.pipe';
import { Express } from 'express';
import { CsvValidationPipe } from 'src/shared/pipes/csv-validation.pipe';


@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile(FileValidationPipe, CsvValidationPipe)
    file: Express.Multer.File,
  ) {
    return this.csvService.processCsv(file);
  }
}