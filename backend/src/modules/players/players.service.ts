import { Inject, Injectable } from '@nestjs/common';
import { IPlayerRepository } from './interfaces/player-repository.interface';
import { Player } from './entities/player.entity';
import { CreatePlayerDto, UpdatePlayerDto } from './dto/player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @Inject('IPlayerRepository')
    private readonly playerRepository: IPlayerRepository,
  ) { }

  getPlayerById(id: number): Promise<Player | undefined> {
    return this.playerRepository.findOneById(id);
  }

  async getPlayerPaginated(
    page: number,
    limit: number,
    filters?: { name?: string; club?: string; position?: string },
  ): Promise<{ data: Player[]; total: number; page: number; limit: number } | undefined> {
    const rs = await this.playerRepository.findAllPaginated(page, limit, filters);
    return rs;
  }

  async updatePlayer(id: number, updateDto: UpdatePlayerDto): Promise<Player | undefined> {
    return this.playerRepository.update(id, updateDto);
  }

  async createPlayer(createDto: CreatePlayerDto): Promise<Player | undefined> {
    return this.playerRepository.create(createDto);
  }
}
