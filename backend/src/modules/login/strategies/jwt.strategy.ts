import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface JwtPayload {
    sub: number;
    usuario: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        const secret = configService.get<string>('JWT_ACCESS_SECRET');
        if (!secret) {
            throw new UnauthorizedException('JWT_ACCESS_SECRET not set');
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.access_token || null,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: secret,
            ignoreExpiration: false,
            passReqToCallback: false,
        });
    }

    async validate(payload: JwtPayload) {
        return { sub: payload.sub, usuario: payload.usuario };
    }
}
