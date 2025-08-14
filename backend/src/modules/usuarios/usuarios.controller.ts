import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsuariosService as UsuariosService } from './usuarios.service';

@Controller('api/users')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.usuariosService.findById(+id);
  }

  @Get('username/:usuario')
  async findByUsuario(@Param('usuario') usuario: string) {
    return await this.usuariosService.findByUsuario(usuario);
  }

  @Patch(':id/refresh-token')
  async updateRefreshToken(
    @Param('id') id: number,
    @Body('refreshToken') refreshToken: string,
  ) {
    return await this.usuariosService.updateRefreshToken(+id, refreshToken);
  }

  @Delete(':id/refresh-token')
  async removeRefreshToken(@Param('id') id: number) {
    return await this.usuariosService.removeRefreshToken(+id);
  }


  @Post('register')
  async register(
    @Body('nombre') nombre: string,
    @Body('usuario') usuario: string,
    @Body('password') password: string,
    @Body('email') email?: string,
  ) {
    // Remove 'email' if it's not a property of Usuario
    return this.usuariosService.create({ nombre, usuario, password });
  }


}
