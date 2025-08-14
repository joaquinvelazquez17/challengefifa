import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlayerModel } from './player.model'; // Sequelize model
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { Player } from '../../entities/player.entity';
import { Op } from 'sequelize';
import playerConfig from 'src/config/player.config';
import { CreatePlayerDto, UpdatePlayerDto } from '../../dto/player.dto';

@Injectable()
export class SequelizePlayerRepository implements IPlayerRepository {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerModel: typeof PlayerModel,
  ) { }

  async findAll(): Promise<Player[]> {
    const playerList = await this.playerModel.findAll();
    return playerList.map((x) => this.mapToEntity(x));
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);
    if (!model) {
      return undefined;
    }
    return this.mapToEntity(model);
  }

  private mapToEntity(model: PlayerModel): Player {
    if (!model) {
      throw new Error('Attempted to map null model to Player entity');
    }

    const data = model.toJSON();
    const player = new Player();
    player.id = data.id;
    player.name = data.longName;
    player.club = data.clubName || 'Unknown Club';
    player.position = data.playerPositions?.split(',')[0].trim() ?? 'Unknown';
    player.nationality = data.nationalityName || 'Unknown Nationality';
    player.rating = data.overall;
    player.speed = data.pace ?? 0;
    player.shooting = data.shooting ?? 0;
    player.dribbling = data.dribbling ?? 0;
    player.passing = data.passing ?? 0;
    player.defending = data.defending ?? 0;
    player.physic = data.physic ?? 0;
    player.faceUrl = data.playerFaceUrl || '';

    return player;
  }

  async findAllPaginated(
    page = 1,
    limit = 10,
    filters?: { name?: string; club?: string; position?: string }
  ): Promise<{ data: Player[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (filters?.name) {
      whereClause.longName = { [Op.like]: `%${filters.name}%` };
    }

    if (filters?.club) {
      whereClause.clubName = { [Op.like]: `%${filters.club}%` };
    }

    if (filters?.position) {
      whereClause.playerPositions = { [Op.like]: `%${filters.position}%` };
    }

    const { rows, count } = await this.playerModel.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['id', 'ASC']],
    });

    const data = rows.map((model) => this.mapToEntity(model));

    return {
      data,
      total: count,
      page,
      limit,
    };
  }

  async update(id: number, updateDto: UpdatePlayerDto): Promise<Player | undefined> {
    // Verificar si el registro existe
    const model = await this.playerModel.findByPk(id);
    if (!model) return undefined;

    // Armar el objeto de actualización
    const updateData: any = {};

    if (updateDto.name !== undefined) updateData.longName = updateDto.name;
    if (updateDto.club !== undefined) updateData.clubName = updateDto.club;
    if (updateDto.position !== undefined) updateData.playerPositions = updateDto.position;
    if (updateDto.nationality !== undefined) updateData.nationalityName = updateDto.nationality;
    if (updateDto.rating !== undefined) updateData.overall = updateDto.rating;
    if (updateDto.speed !== undefined) updateData.pace = updateDto.speed; // o pace: 94 si es fijo
    if (updateDto.shooting !== undefined) updateData.shooting = updateDto.shooting;
    if (updateDto.dribbling !== undefined) updateData.dribbling = updateDto.dribbling;
    if (updateDto.passing !== undefined) updateData.passing = updateDto.passing;
    if (updateDto.defending !== undefined) updateData.defending = updateDto.defending;
    if (updateDto.physic !== undefined) updateData.physic = updateDto.physic;

    // Actualizar directamente en la base de datos
    await this.playerModel.update(updateData, { where: { id } });

    // Obtener el modelo actualizado desde la DB
    const updatedModel = await this.playerModel.findByPk(id);

    if (!updatedModel) return undefined;
    // Mapear el modelo actualizado a la entidad Player
    return this.mapToEntity(updatedModel);

  }

  async create(createDto: CreatePlayerDto): Promise<Player> {
    const createData: any = {
      fifaVersion: playerConfig.fifaVersion,
      fifaUpdate: playerConfig.fifaUpdate,
      playerFaceUrl: createDto.faceUrl,
      longName: createDto.name,
      playerPositions: createDto.position,
      clubName: createDto.club,
      nationalityName: createDto.nationality,
      overall: createDto.rating,
      potential: createDto.potential,
      age: createDto.age,
      pace: createDto.speed,
      shooting: createDto.shooting,
      passing: createDto.passing,
      dribbling: createDto.dribbling,
      physic: createDto.physic,
      defending: createDto.defending,
    }

    const playerModel = await this.playerModel.create(createData);
    return this.mapToEntity(playerModel);
  }

}
