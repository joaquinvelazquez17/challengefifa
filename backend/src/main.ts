import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  // ✅ Configuración de CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Cambiar según entorno
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ✅ Pipes globales de validación (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en DTO
      forbidNonWhitelisted: true, // lanza error si hay propiedades desconocidas
      transform: true, // transforma tipos (ej: string a number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
