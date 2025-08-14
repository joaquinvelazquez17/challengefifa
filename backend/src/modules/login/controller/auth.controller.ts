import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Res,
    Get,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { JwtRefreshGuard } from '../../guards/jwt-refresh.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request, Response } from 'express';

declare module 'express' {
    interface Request {
        user?: any;
    }
}

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.login(dto);

        // Setear cookie HttpOnly con accessToken
        res.cookie('access_token', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true en producción
            sameSite: 'lax',
            maxAge: 1000 * 60 * 15, // 15 minutos
        });

        // Setear cookie HttpOnly con refreshToken
        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true en producción
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días, igual que el token
        });

        return { message: 'Login exitoso' };
    }


    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = req.user as any; // payload del token
        const refreshToken = req.cookies['refresh_token']; // si usas refresh token en cookie
        return { message: refreshToken };
        const tokens = await this.authService.refresh(user.sub, refreshToken);

        // Actualizar cookies con tokens nuevos
        res.cookie('access_token', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 15,
        });

        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return { message: 'Tokens actualizados' };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        console.log("Cookies recibidas:", req.cookies); // <--- Aquí ves access_token y refresh_token

        const user = req.user as any;
        console.log("Usuario identificado:", user.sub);

        await this.authService.logout(user.sub);

        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return { message: 'Logout exitoso' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Req() req: Request) {
        console.log('Cookies recibidas:', req.cookies);
        return req.user;
    }
}
