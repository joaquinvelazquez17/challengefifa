import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDto, UpdatePlayerDto, CreatePlayerDto } from './dto/player.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) { }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPlayerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlayerDto | undefined> {
    const player = await this.playersService.getPlayerById(id);
    console.log(`Fetching player  ${player}`);
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found.`);
    }

    return new PlayerDto(player);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async getPlayerPaginated(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('name') name?: string,
    @Query('club') club?: string,
    @Query('position') position?: string,
  ): Promise<{ data: PlayerDto[]; total: number; page: number; limit: number }> {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    const rs = await this.playersService.getPlayerPaginated(parsedPage, parsedLimit, { name, club, position });

    if (!rs || rs.data.length === 0) {
      throw new NotFoundException(`Players not found.`);
    }

    return rs;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePlayerDto,
  ): Promise<PlayerDto> {
    const updated = await this.playersService.updatePlayer(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Player with ID ${id} not found.`);
    }
    return new PlayerDto(updated);
  }

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto): Promise<PlayerDto | undefined> {
    return this.playersService.createPlayer(createPlayerDto);
  }
}
