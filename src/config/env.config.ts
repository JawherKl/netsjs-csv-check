import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvConfig {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    dotenv.config();
    this.envConfig = process.env;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  getNumber(key: string): number {
    return parseInt(this.envConfig[key] || '0', 10);
  }

  getBoolean(key: string): boolean {
    return this.envConfig[key] === 'true';
  }
}