import { Usuario } from '../entities/usuarios.entity';

export interface IUsuariosRepository {
  findAll(): Promise<Usuario[]>;

  findOne(usuario: string): Promise<Usuario | null>;

  updateRefreshToken(userId: number, refreshToken: string): Promise<void>;

  findOneById(id: number): Promise<Usuario | undefined>;

  removeRefreshToken(userId: number): Promise<void>;

  create(data: Partial<Usuario>): Promise<Usuario>;

  save(usuario: Usuario): Promise<Usuario>;

}
