import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from '../config/typeorm.config';

loadEnv();

const configService = new ConfigService(process.env);

export default new DataSource(buildTypeOrmOptions(configService));
