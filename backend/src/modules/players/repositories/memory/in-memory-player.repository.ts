import { CreatePlayerDto, UpdatePlayerDto } from '../../dto/player.dto';
import { Player } from '../../entities/player.entity';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';

export class InMemoryPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];

  async findAll(): Promise<Player[]> {
    return Promise.resolve([...this.players]);
  }

  async findOneById(id: number): Promise<Player | undefined> {
    return Promise.resolve(this.players.find((p) => p.id === id));
  }

  async findAllPaginated(
    page = 1,
    limit = 10,
    filters?: {
      name?: string;
      club?: string;
      position?: string;
    }
  ): Promise<{ data: Player[]; total: number; page: number; limit: number }> {
    let filteredPlayers = [...this.players];

    if (filters) {
      if (filters.name) {
        filteredPlayers = filteredPlayers.filter((p) =>
          p.name.toLowerCase().includes(filters.name!.toLowerCase())
        );
      }

      if (filters.club) {
        filteredPlayers = filteredPlayers.filter((p) =>
          p.club.toLowerCase().includes(filters.club!.toLowerCase())
        );
      }

      if (filters.position) {
        filteredPlayers = filteredPlayers.filter((p) =>
          p.position.toLowerCase().includes(filters.position!.toLowerCase())
        );
      }
    }

    const total = filteredPlayers.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filteredPlayers.slice(start, end);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async update(id: number, updateDto: UpdatePlayerDto): Promise<Player | undefined> {
    const index = this.players.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    const existingPlayer = this.players[index];
    const updatedPlayer = {
      ...existingPlayer,
      ...updateDto,
    };

    this.players[index] = updatedPlayer;
    return Promise.resolve(updatedPlayer);
  }

  async create(createDto: CreatePlayerDto): Promise<Player | undefined> {
    const newPlayer = new Player();
    Object.assign(newPlayer, createDto);
    newPlayer.id = this.players.length + 1; // Simple ID generation logic

    this.players.push(newPlayer);
    return Promise.resolve(newPlayer);
  }
}