import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: dbConfig.synchronize,
  schema: 'mySchema',
};

// const dbConfig = config.get('db');
// console.log(dbConfig.username);

// export const typeORMConfig: TypeOrmModuleOptions = {
//   type: dbConfig.type,
//   host: process.env.HOSTNAME || dbConfig.host,
//   port: process.env.PORT || dbConfig.port,
//   username: process.env.USERNAME || dbConfig.username,
//   password: process.env.PASSWORD || dbConfig.password,
//   database: process.env.DB_NAME || dbConfig.database,
//   entities: [__dirname + '/../**/*.entity.{js,ts}'],
//   synchronize: dbConfig.synchronize,
// };
