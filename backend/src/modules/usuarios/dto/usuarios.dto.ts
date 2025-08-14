import { IsString, MaxLength, IsOptional, IsNotEmpty, IsDateString } from 'class-validator';

export class UsuarioDto {
  @IsString()
  @MaxLength(100)
  declare nombre: string;

  @IsString()
  @MaxLength(100)
  declare usuario: string;

  @IsString()
  @MaxLength(255)
  declare password: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  declare refreshToken: string | null;
}


export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  usuario: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsDateString()
  @IsOptional()
  created_at?: string;

  @IsDateString()
  @IsOptional()
  updated_at?: string;
}

export class UpdateUsuarioDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  usuario?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsDateString()
  @IsOptional()
  updated_at?: string;
}
