"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const automations_service_1 = require("../automations/automations.service");
let UsersService = class UsersService {
    prisma;
    automationsService;
    constructor(prisma, automationsService) {
        this.prisma = prisma;
        this.automationsService = automationsService;
    }
    findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async getProfile(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toProfileResponse(user);
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: dto.name,
                phoneNumber: dto.phoneNumber,
                university: dto.university,
                monthlyAllowance: dto.monthlyAllowance,
                expectedDailySpend: dto.expectedDailySpend,
                timeSkipDays: dto.timeSkipDays,
            },
        });
        if (dto.timeSkipDays !== undefined) {
            await Promise.all([
                this.automationsService.materializeDailyExpenses(userId),
                this.automationsService.materializeAutoSavings(userId),
            ]);
        }
        return this.toProfileResponse(user);
    }
    async timeSkip(userId, days) {
        const currentUser = await this.findById(userId);
        if (!currentUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const previousReferenceDate = this.addDays(this.startOfUtcDay(new Date()), currentUser.timeSkipDays);
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                timeSkipDays: currentUser.timeSkipDays + days,
            },
        });
        const nextReferenceDate = this.addDays(previousReferenceDate, days);
        const firstSkippedDate = this.addDays(previousReferenceDate, 1);
        await Promise.all([
            this.automationsService.materializeDailyExpensesForRange(userId, firstSkippedDate, nextReferenceDate),
            this.automationsService.materializeAutoSavingsForRange(userId, firstSkippedDate, nextReferenceDate),
        ]);
        return this.toProfileResponse(user);
    }
    addDays(date, days) {
        return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
    }
    startOfUtcDay(date) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
    toProfileResponse(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            monthlyAllowance: user.monthlyAllowance === null ? null : Number(user.monthlyAllowance),
            expectedDailySpend: user.expectedDailySpend === null ? null : Number(user.expectedDailySpend),
            timeSkipDays: user.timeSkipDays,
            phoneNumber: user.phoneNumber,
            university: user.university,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        automations_service_1.AutomationsService])
], UsersService);
//# sourceMappingURL=users.service.js.map