import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsuarioModel } from './usuarios.model'; // Sequelize model para usuarios
import { IUsuariosRepository } from '../../interfaces/usuarios-repository.interface';
import { Usuario } from '../../entities/usuarios.entity'; // O cambia Player a Usuario si quieres

@Injectable()
export class SequelizeUsuarioRepository implements IUsuariosRepository {
  constructor(
    @InjectModel(UsuarioModel)
    private readonly usuarioModel: typeof UsuarioModel,
  ) { }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioModel.findAll();
    return usuarios.map((u) => this.mapToEntity(u));
  }

  async findOneById(id: number): Promise<Usuario | undefined> {
    const usuario = await this.usuarioModel.findByPk(id);
    if (!usuario) {
      return undefined;
    }
    return this.mapToEntity(usuario);
  }

  async findOne(usuario: string): Promise<Usuario | null> {
    const model = await this.usuarioModel.findOne({ where: { usuario } });
    if (!model) return null;

    return this.mapToEntity(model);
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.usuarioModel.update({ refreshToken }, { where: { id: userId } });
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.usuarioModel.update({ refreshToken: null }, { where: { id: userId } });
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    // Map only the fields that exist in UsuarioModel
    const createData: any = {
      nombre: data.nombre,
      usuario: data.usuario,
      password: data.password,
      refreshToken: data.refreshToken ?? null,
      // Add other fields as needed
    };
    const newUsuario = await this.usuarioModel.create(createData);
    return this.mapToEntity(newUsuario);
  }

  async save(usuario: Usuario): Promise<Usuario> {
    const upsertData: any = {
      id: usuario.id,
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      password: usuario.password,
      refreshToken: usuario.refreshToken ?? null,
      created_at: usuario.created_at,
      updated_at: usuario.updated_at,
      // Add other fields as needed
    };
    const [updatedUsuario] = await this.usuarioModel.upsert(upsertData);
    return this.mapToEntity(updatedUsuario);
  }

  private mapToEntity(model: UsuarioModel): Usuario {
    if (!model) {
      throw new Error('Intento de mapear modelo nulo a entidad Usuario');
    }
    const data = model.toJSON();
    const usuario = new Usuario(); // O cambia Player a Usuario si tienes esa entidad
    usuario.id = data.id;
    usuario.nombre = data.nombre;
    usuario.usuario = data.usuario;
    usuario.password = data.password;
    usuario.refreshToken = data.refreshToken ?? null;
    usuario.created_at = data.created_at;
    usuario.updated_at = data.updated_at;
    return usuario;
  }
}
