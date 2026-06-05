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
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let BudgetsService = class BudgetsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, query) {
        const budgets = await this.prisma.budget.findMany({
            where: {
                userId,
                categoryId: query.categoryId,
                period: query.period,
                startDate: query.startDate ? { gte: new Date(query.startDate) } : undefined,
                endDate: query.endDate ? { lte: new Date(query.endDate) } : undefined,
            },
            include: {
                category: true,
            },
            orderBy: {
                startDate: 'desc',
            },
        });
        return Promise.all(budgets.map((budget) => this.withUsageSummary(budget)));
    }
    async findOne(userId, budgetId) {
        const budget = await this.prisma.budget.findFirst({
            where: {
                id: budgetId,
                userId,
            },
            include: {
                category: true,
            },
        });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        return this.withUsageSummary(budget);
    }
    async create(userId, dto) {
        this.ensureValidDateRange(dto.startDate, dto.endDate);
        if (dto.categoryId) {
            await this.ensureExpenseCategoryCanBeUsed(userId, dto.categoryId);
        }
        const budget = await this.prisma.budget.create({
            data: {
                userId,
                categoryId: dto.categoryId,
                name: dto.name,
                period: dto.period ?? client_1.BudgetPeriod.MONTHLY,
                limitAmount: dto.limitAmount,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
            },
            include: {
                category: true,
            },
        });
        return this.withUsageSummary(budget);
    }
    async update(userId, budgetId, dto) {
        const existingBudget = await this.findOwnedBudgetOrThrow(userId, budgetId);
        const nextStartDate = dto.startDate ?? existingBudget.startDate.toISOString();
        const nextEndDate = dto.endDate ?? existingBudget.endDate.toISOString();
        this.ensureValidDateRange(nextStartDate, nextEndDate);
        if (dto.categoryId) {
            await this.ensureExpenseCategoryCanBeUsed(userId, dto.categoryId);
        }
        const budget = await this.prisma.budget.update({
            where: { id: budgetId },
            data: {
                categoryId: dto.categoryId,
                name: dto.name,
                period: dto.period,
                limitAmount: dto.limitAmount,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            },
            include: {
                category: true,
            },
        });
        return this.withUsageSummary(budget);
    }
    async delete(userId, budgetId) {
        await this.findOwnedBudgetOrThrow(userId, budgetId);
        await this.prisma.budget.delete({
            where: { id: budgetId },
        });
        return { message: 'Budget deleted successfully' };
    }
    async findOwnedBudgetOrThrow(userId, budgetId) {
        const budget = await this.prisma.budget.findFirst({
            where: {
                id: budgetId,
                userId,
            },
        });
        if (!budget) {
            throw new common_1.NotFoundException('Budget not found');
        }
        return budget;
    }
    async ensureExpenseCategoryCanBeUsed(userId, categoryId) {
        const category = await this.prisma.category.findFirst({
            where: {
                id: categoryId,
                OR: [{ userId: null }, { userId }],
            },
        });
        if (!category) {
            throw new common_1.ForbiddenException('Category cannot be used');
        }
        if (category.type !== client_1.TransactionType.EXPENSE) {
            throw new common_1.BadRequestException('Budget category must be an expense category');
        }
    }
    ensureValidDateRange(startDate, endDate) {
        if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
            throw new common_1.BadRequestException('startDate must be before or equal to endDate');
        }
    }
    async withUsageSummary(budget) {
        const spent = await this.prisma.transaction.aggregate({
            where: {
                userId: budget.userId,
                type: client_1.TransactionType.EXPENSE,
                categoryId: budget.categoryId ?? undefined,
                transactionAt: {
                    gte: budget.startDate,
                    lte: budget.endDate,
                },
            },
            _sum: {
                amount: true,
            },
        });
        const spentAmount = Number(spent._sum.amount ?? 0);
        const limitAmount = Number(budget.limitAmount);
        const remainingAmount = limitAmount - spentAmount;
        const usagePercentage = limitAmount > 0 ? Number(((spentAmount / limitAmount) * 100).toFixed(2)) : 0;
        return {
            ...budget,
            limitAmount,
            spentAmount,
            remainingAmount,
            usagePercentage,
            isExceeded: spentAmount > limitAmount,
        };
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map