"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    configService;
    jwtService;
    prisma;
    saltRounds = 12;
    constructor(configService, jwtService, prisma) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email is already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
                phoneNumber: dto.phoneNumber,
                university: dto.university,
            },
        });
        return this.createAuthResponse(user);
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        return this.createAuthResponse(user);
    }
    async refreshTokens(refreshToken) {
        const payload = await this.verifyRefreshToken(refreshToken);
        const tokenHash = this.hashToken(refreshToken);
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
        if (!storedToken ||
            storedToken.userId !== payload.sub ||
            storedToken.revokedAt ||
            storedToken.expiresAt.getTime() <= Date.now()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() },
        });
        return this.createAuthResponse(storedToken.user);
    }
    async logout(userId, refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        await this.prisma.refreshToken.updateMany({
            where: {
                userId,
                tokenHash,
                revokedAt: null,
            },
            data: {
                revokedAt: new Date(),
            },
        });
        return { message: 'Logged out successfully' };
    }
    async createAuthResponse(user) {
        const accessToken = await this.signAccessToken(user);
        const refreshToken = await this.signRefreshToken(user);
        await this.prisma.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: this.hashToken(refreshToken),
                expiresAt: this.getRefreshTokenExpiryDate(),
            },
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    }
    signAccessToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
        });
    }
    signRefreshToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });
    }
    async verifyRefreshToken(refreshToken) {
        try {
            return await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    hashToken(token) {
        return (0, node_crypto_1.createHash)('sha256').update(token).digest('hex');
    }
    getRefreshTokenExpiryDate() {
        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');
        const match = expiresIn.match(/^(\d+)([dhm])$/);
        if (!match) {
            return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }
        const value = Number(match[1]);
        const unit = match[2];
        const multipliers = {
            d: 24 * 60 * 60 * 1000,
            h: 60 * 60 * 1000,
            m: 60 * 1000,
        };
        return new Date(Date.now() + value * multipliers[unit]);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map