import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';
import { Express } from 'express';

export class CsvUploadDto {
    @IsNotEmpty()
    readonly file: Express.Multer.File;

    @IsString()
    @IsNotEmpty()
    readonly delimiter: string = ',';

    @IsBoolean()
    @IsNotEmpty()
    readonly hasHeader: boolean = true;
}