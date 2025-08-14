import { IsOptional, IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class PlayerDto {
  id: number;
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number;
  shooting: number;
  dribbling: number;
  passing: number;

  constructor(partial: Partial<PlayerDto>) {
    Object.assign(this, partial);
  }
}


export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  club?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99)
  rating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99)
  speed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99)
  shooting?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99)
  dribbling?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99)
  passing?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99)
  defending?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99)
  physic?: number;
}

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  club?: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsNumber()
  speed?: number;

  @IsOptional()
  @IsNumber()
  shooting?: number;

  @IsOptional()
  @IsNumber()
  dribbling?: number;

  @IsOptional()
  @IsNumber()
  passing?: number;

  @IsNotEmpty()
  @IsString()
  faceUrl: string;

  @IsNotEmpty()
  @IsNumber()
  potential: number;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsNumber()
  defending: number;

  @IsNotEmpty()
  @IsNumber()
  physic: number;


}

