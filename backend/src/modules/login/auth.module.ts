import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module'; // 👈 importar el módulo correcto

@Module({
  imports: [
    ConfigModule, // 👈 si usás ConfigService
    UsuariosModule, // 👈 necesario para que funcione la inyección
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}), // la config la toma del ConfigService
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule { }
