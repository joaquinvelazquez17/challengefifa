import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface JwtPayload {
    sub: number;
    usuario: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private configService: ConfigService) {
        const secret = configService.get<string>('JWT_REFRESH_SECRET');
        if (!secret) {
            throw new UnauthorizedException('JWT_REFRESH_SECRET not set');
        }

        super(<StrategyOptionsWithRequest>{
            jwtFromRequest: (req: Request) => {
                if (req && req.cookies) {
                    return req.cookies['refresh_token'];
                }
                return null;
            },
            secretOrKey: secret,
            passReqToCallback: true,
            ignoreExpiration: false,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        // Aquí podés usar req si necesitás (ej: para comparar tokens, etc)
        return { sub: payload.sub, usuario: payload.usuario };
    }
}
