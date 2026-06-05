import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly configService;
    private readonly jwtService;
    private readonly prisma;
    private readonly saltRounds;
    constructor(configService: ConfigService, jwtService: JwtService, prisma: PrismaService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    refreshTokens(refreshToken: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    logout(userId: string, refreshToken: string): Promise<{
        message: string;
    }>;
    private createAuthResponse;
    private signAccessToken;
    private signRefreshToken;
    private verifyRefreshToken;
    private hashToken;
    private getRefreshTokenExpiryDate;
}
