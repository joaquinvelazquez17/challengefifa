import { Like, Repository } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { PlayerDto } from './player.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlayerDto, UpdatePlayerDto } from '../../dto/player.dto';

@Injectable()
export class TypeOrmPlayerRepository implements IPlayerRepository {
  constructor(
    @InjectRepository(PlayerDto)
    private readonly playerRepository: Repository<PlayerDto>,
  ) { }

  async findAll(): Promise<Player[]> {
    const playerList = (await this.playerRepository.find()).map((x) =>
      this.mapToEntity(x),
    );

    return playerList;
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const dto = await this.playerRepository.findOne({ where: { id } });
    if (dto === null) {
      return undefined;
    }

    const entity = this.mapToEntity(dto);

    return entity;
  }

  private mapToEntity(playerDto: PlayerDto): Player {
    const player = new Player();
    player.id = playerDto.id;
    player.name = playerDto.longName;
    player.club = playerDto.clubName || 'Unknown Club';
    player.position = playerDto.playerPositions.split(',')[0].trim();
    player.nationality = playerDto.nationalityName || 'Unknown Nationality';
    player.rating = playerDto.overall;
    player.speed = playerDto.pace ?? 0; // Using nullish coalescing operator (??) for numeric defaults
    player.shooting = playerDto.shooting ?? 0;
    player.dribbling = playerDto.dribbling ?? 0;
    player.passing = playerDto.passing ?? 0;

    return player;
  }

  async findAllPaginated(
    page = 1,
    limit = 10,
    filters?: { name?: string; club?: string; position?: string },
  ): Promise<{ data: Player[]; total: number; page: number; limit: number }> {
    const where: any = {};

    if (filters?.name) {
      where.name = Like(`%${filters.name}%`);
    }

    if (filters?.club) {
      where.club = Like(`%${filters.club}%`);
    }

    if (filters?.position) {
      where.position = Like(`%${filters.position}%`);
    }

    const [dtos, total] = await this.playerRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    const data = dtos.map((x) => this.mapToEntity(x));

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async update(id: number, updateDto: UpdatePlayerDto): Promise<Player | undefined> {
    const existing = await this.playerRepository.findOne({ where: { id } });
    if (!existing) return undefined;

    Object.assign(existing, updateDto);
    const updated = await this.playerRepository.save(existing);
    return this.mapToEntity(updated);
  }


  async create(createDto: CreatePlayerDto): Promise<Player | undefined> {
    const playerDto = new PlayerDto();
    Object.assign(playerDto, createDto);

    return this.playerRepository.save(playerDto).then((saved) => {
      return this.mapToEntity(saved);
    });
  }
}
