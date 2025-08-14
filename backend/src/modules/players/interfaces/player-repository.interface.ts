import { CreatePlayerDto, UpdatePlayerDto } from '../dto/player.dto';
import { Player } from '../entities/player.entity';

export interface IPlayerRepository {
  findAll(): Promise<Player[]>;
  findOneById(id: number): Promise<Player | undefined>;

  findAllPaginated(
    page: number,
    limit: number,
    filters?: {
      name?: string;
      club?: string;
      position?: string;
    },
  ): Promise<{
    data: Player[];
    total: number;
    page: number;
    limit: number;
  }>;

  update(id: number, updateDto: UpdatePlayerDto): Promise<Player | undefined>;

  create(createDto: CreatePlayerDto): Promise<Player | undefined>;

}
