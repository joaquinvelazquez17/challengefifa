// // src/config/typeorm.config.ts
// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { PlayerDto } from 'src/modules/players/repositories/typeorm/player.dto';

// const typeOrmConfig: TypeOrmModuleOptions = {
//   type: 'mysql',
//   host: 'localhost', // Si NestJS corre fuera de Docker, usa 'localhost' ; Si NestJS corre dentro de Docker Compose, usa 'mysql_db' (el nombre del servicio)
//   port: 3306,
//   username: 'nestjs_user',
//   password: 'nestjs_password',
//   database: 'nestjs_database',
//   entities: [PlayerDto],
//   synchronize: true,
// };

// export default typeOrmConfig;

// src/config/typeorm.config.ts

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// //Para docker
// export const typeOrmConfig: TypeOrmModuleOptions = {
//     type: 'postgres',
//     host: 'postgres',
//     port: 5432,
//     username: 'user',
//     password: 'password',
//     database: 'turnos_db',
//     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//     synchronize: true, // Solo para dev. ¡NO en producción!<<<<<<<<<<<<<<<<<<<<<<
// };

//Para local
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost', // Si NestJS corre fuera de Docker, usa 'localhost' ; Si NestJS corre dentro de Docker Compose, usa 'mysql_db' (el nombre del servicio)
  port: 3306,
  username: 'nestjs_user',
  password: 'nestjs_password',
  database: 'nestjs_database',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};

