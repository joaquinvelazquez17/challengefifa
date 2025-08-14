import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { SequelizeUsuarioRepository } from './repositories/sequelize/sequelize-usuarios.repository';
import { UsuarioModel } from './repositories/sequelize/usuarios.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([UsuarioModel],)],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    {
      provide: 'IUsuariosRepository',
      useClass: SequelizeUsuarioRepository,
    },
  ],
  exports: [UsuariosService],

})
export class UsuariosModule { }
