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
exports.AutomationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const DAY_IN_MS = 24 * 60 * 60 * 1000;
let AutomationsService = class AutomationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getDailyExpenseSetting(userId) {
        return this.prisma.dailyExpenseSetting.findUnique({
            where: { userId },
            include: { category: true },
        });
    }
    async upsertDailyExpenseSetting(userId, dto) {
        await this.ensureCategoryCanBeUsed(userId, dto.categoryId, dto.type);
        const data = {
            categoryId: dto.categoryId,
            amount: dto.amount,
            title: dto.title?.trim() || 'Kebutuhan harian',
            startDate: this.startOfUtcDay(new Date(dto.startDate)),
            isActive: dto.isActive ?? true,
        };
        return this.prisma.dailyExpenseSetting.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                ...data,
            },
            include: { category: true },
        });
    }
    async materializeDailyExpenses(userId) {
        const today = this.startOfUtcDay(await this.getReferenceDate(userId));
        await this.materializeDailyExpensesForRange(userId, new Date(0), today);
    }
    async materializeDailyExpensesForRange(userId, fromDate, toDate) {
        const setting = await this.prisma.dailyExpenseSetting.findUnique({
            where: { userId },
            include: { category: true },
        });
        if (!setting || !setting.isActive) {
            return;
        }
        const startDate = this.maxDate(this.startOfUtcDay(setting.startDate), this.startOfUtcDay(fromDate));
        const endDate = this.startOfUtcDay(toDate);
        if (startDate.getTime() > endDate.getTime()) {
            return;
        }
        for (const date of this.eachDate(startDate, endDate)) {
            await this.prisma.transaction.upsert({
                where: {
                    dailyExpenseSettingId_generatedForDate: {
                        dailyExpenseSettingId: setting.id,
                        generatedForDate: date,
                    },
                },
                update: {},
                create: {
                    userId,
                    categoryId: setting.categoryId,
                    dailyExpenseSettingId: setting.id,
                    generatedForDate: date,
                    type: setting.category.type,
                    amount: setting.amount,
                    title: setting.title,
                    transactionAt: date,
                    description: 'Auto expense kebutuhan harian',
                },
            });
        }
    }
    getAutoSavingsSetting(userId, savingsGoalId) {
        return this.prisma.autoSavingsSetting.findFirst({
            where: { userId, savingsGoalId },
        });
    }
    async upsertAutoSavingsSetting(userId, savingsGoalId, dto) {
        await this.ensureSavingsGoalCanBeUsed(userId, savingsGoalId);
        const data = {
            amount: dto.amount,
            startDate: this.startOfUtcDay(new Date(dto.startDate)),
            isActive: dto.isActive ?? true,
        };
        return this.prisma.autoSavingsSetting.upsert({
            where: {
                userId_savingsGoalId: {
                    userId,
                    savingsGoalId,
                },
            },
            update: data,
            create: {
                userId,
                savingsGoalId,
                ...data,
            },
        });
    }
    async materializeAutoSavings(userId) {
        const today = this.startOfUtcDay(await this.getReferenceDate(userId));
        await this.materializeAutoSavingsForRange(userId, new Date(0), today);
    }
    async materializeAutoSavingsForRange(userId, fromDate, toDate) {
        const settings = await this.prisma.autoSavingsSetting.findMany({
            where: {
                userId,
                isActive: true,
                savingsGoal: {
                    status: client_1.GoalStatus.ACTIVE,
                },
            },
            include: { savingsGoal: true },
        });
        const rangeStartDate = this.startOfUtcDay(fromDate);
        const rangeEndDate = this.startOfUtcDay(toDate);
        for (const setting of settings) {
            const startDate = this.maxDate(this.startOfUtcDay(setting.startDate), rangeStartDate);
            if (startDate.getTime() > rangeEndDate.getTime()) {
                continue;
            }
            for (const date of this.eachDate(startDate, rangeEndDate)) {
                const currentGoal = await this.prisma.savingsGoal.findFirst({
                    where: {
                        id: setting.savingsGoalId,
                        userId,
                    },
                });
                if (!currentGoal || currentGoal.status !== client_1.GoalStatus.ACTIVE) {
                    break;
                }
                const remainingAmount = Number(currentGoal.targetAmount) - Number(currentGoal.currentAmount);
                if (remainingAmount <= 0) {
                    await this.prisma.savingsGoal.update({
                        where: { id: currentGoal.id },
                        data: { status: client_1.GoalStatus.COMPLETED },
                    });
                    break;
                }
                const contributionAmount = Math.min(Number(setting.amount), remainingAmount);
                await this.prisma.$transaction(async (tx) => {
                    const existing = await tx.savingsContribution.findUnique({
                        where: {
                            autoSavingsSettingId_generatedForDate: {
                                autoSavingsSettingId: setting.id,
                                generatedForDate: date,
                            },
                        },
                    });
                    if (existing) {
                        return;
                    }
                    await tx.savingsContribution.create({
                        data: {
                            userId,
                            savingsGoalId: setting.savingsGoalId,
                            autoSavingsSettingId: setting.id,
                            generatedForDate: date,
                            amount: contributionAmount,
                            note: 'Auto setor tabungan',
                            contributedAt: date,
                        },
                    });
                    const nextAmount = Number(currentGoal.currentAmount) + contributionAmount;
                    await tx.savingsGoal.update({
                        where: { id: currentGoal.id },
                        data: {
                            currentAmount: nextAmount,
                            status: nextAmount >= Number(currentGoal.targetAmount)
                                ? client_1.GoalStatus.COMPLETED
                                : currentGoal.status,
                        },
                    });
                });
            }
        }
    }
    async ensureCategoryCanBeUsed(userId, categoryId, transactionType) {
        const category = await this.prisma.category.findFirst({
            where: {
                id: categoryId,
                type: transactionType,
                OR: [{ userId: null }, { userId }],
            },
        });
        if (!category) {
            throw new common_1.ForbiddenException('Category cannot be used');
        }
    }
    async ensureSavingsGoalCanBeUsed(userId, goalId) {
        const goal = await this.prisma.savingsGoal.findFirst({
            where: { id: goalId, userId },
        });
        if (!goal) {
            throw new common_1.NotFoundException('Savings goal not found');
        }
        if (goal.status === client_1.GoalStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot automate a cancelled savings goal');
        }
    }
    eachDate(startDate, endDate) {
        const dates = [];
        let cursor = this.startOfUtcDay(startDate);
        const end = this.startOfUtcDay(endDate);
        while (cursor.getTime() <= end.getTime()) {
            dates.push(cursor);
            cursor = new Date(cursor.getTime() + DAY_IN_MS);
        }
        return dates;
    }
    startOfUtcDay(date) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
    maxDate(first, second) {
        return first.getTime() >= second.getTime() ? first : second;
    }
    async getReferenceDate(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { timeSkipDays: true },
        });
        return new Date(Date.now() + (user?.timeSkipDays ?? 0) * DAY_IN_MS);
    }
};
exports.AutomationsService = AutomationsService;
exports.AutomationsService = AutomationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AutomationsService);
//# sourceMappingURL=automations.service.js.map