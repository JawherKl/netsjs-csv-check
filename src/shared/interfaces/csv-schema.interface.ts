export enum CsvDataType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  EMAIL = 'email',
  BOOLEAN = 'boolean'
}

export interface CsvColumnSchema {
  name: string;
  type: CsvDataType;
  required?: boolean;
  validator?: (value: string) => boolean;
}

export interface CsvSchema {
  delimiter: string;
  columns: CsvColumnSchema[];
}