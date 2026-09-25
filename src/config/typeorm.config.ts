import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export function buildTypeOrmOptions(config: ConfigService): DataSourceOptions {
  return {
    type: 'postgres',
    username: config.get<string>('POSTGRES_USER'),
    password: config.get<string>('POSTGRES_PASSWORD'),
    database: config.get<string>('POSTGRES_DB'),
    synchronize: false,
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
    logging: config.get<string>('NODE_ENV') === 'development',
  };
}
