import {
    Injectable,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { TokenDto } from '../dto/token.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async login(dto: LoginDto): Promise<TokenDto> {
        const usuario = await this.usuariosService.findByUsuario(dto.usuario);
        if (!usuario || !(await bcrypt.compare(dto.password, usuario.password))) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const payload = { sub: usuario.id, usuario: usuario.usuario };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '15m',
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usuariosService.updateRefreshToken(usuario.id, hashedRefreshToken);

        return { accessToken, refreshToken };
    }

    async refresh(userId: number, refreshToken: string): Promise<TokenDto> {
        const usuario = await this.usuariosService.findById(userId);
        if (!usuario || !usuario.refreshToken) {
            throw new ForbiddenException('Access denied');
        }

        const isMatch = await bcrypt.compare(refreshToken, usuario.refreshToken);
        if (!isMatch) {
            throw new ForbiddenException('Invalid refresh token');
        }

        const payload = { sub: usuario.id, usuario: usuario.usuario };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: '15m',
        });

        const newRefreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });

        const hashed = await bcrypt.hash(newRefreshToken, 10);
        await this.usuariosService.updateRefreshToken(usuario.id, hashed);

        return { accessToken, refreshToken: newRefreshToken };
    }

    async logout(userId: number): Promise<void> {
        console.log(await this.usuariosService.removeRefreshToken(userId));
    }

}
