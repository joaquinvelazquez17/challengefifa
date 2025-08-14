import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUsuariosRepository } from './interfaces/usuarios-repository.interface';
import { Usuario } from './entities/usuarios.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject('IUsuariosRepository')
    private readonly usuariosRepository: IUsuariosRepository,
    private readonly configService: ConfigService,

  ) { }

  async findByUsuario(usuario: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne(usuario);
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.usuariosRepository.updateRefreshToken(userId, refreshToken);
  }

  async findById(id: number): Promise<Usuario | undefined> {
    return this.usuariosRepository.findOneById(id);
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.usuariosRepository.removeRefreshToken(userId);
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    if (!data.password) {
      throw new BadRequestException('El campo "password" es obligatorio');
    }

    const saltRoundsStr = this.configService.get<string>('BCRYPT_SALT_ROUNDS');
    const saltRounds = parseInt(saltRoundsStr ?? '', 10);

    if (!saltRoundsStr || isNaN(saltRounds)) {
      throw new InternalServerErrorException('BCRYPT_SALT_ROUNDS no está configurado correctamente');
    }

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser = await this.usuariosRepository.create({
      ...data,
      password: hashedPassword,
    });

    return newUser;
  }

}
