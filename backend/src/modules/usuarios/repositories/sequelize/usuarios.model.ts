// modules/usuarios/repositories/sequelize/usuario.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'usuarios', timestamps: true })
export class UsuarioModel extends Model<UsuarioModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare nombre: string;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare usuario: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  declare refreshToken?: string | null;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare created_at: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updated_at: Date;
}
