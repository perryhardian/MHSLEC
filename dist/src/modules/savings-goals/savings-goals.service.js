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
exports.SavingsGoalsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const automations_service_1 = require("../automations/automations.service");
let SavingsGoalsService = class SavingsGoalsService {
    prisma;
    automationsService;
    constructor(prisma, automationsService) {
        this.prisma = prisma;
        this.automationsService = automationsService;
    }
    async findAll(userId, query) {
        await this.automationsService.materializeAutoSavings(userId);
        const goals = await this.prisma.savingsGoal.findMany({
            where: {
                userId,
                status: query.status,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return goals.map((goal) => this.withProgressSummary(goal));
    }
    async findOne(userId, goalId) {
        await this.automationsService.materializeAutoSavings(userId);
        const goal = await this.findOwnedGoalOrThrow(userId, goalId);
        return this.withProgressSummary(goal);
    }
    async create(userId, dto) {
        if (dto.targetDate && new Date(dto.targetDate).getTime() < Date.now()) {
            throw new common_1.BadRequestException('targetDate should be in the future');
        }
        const goal = await this.prisma.savingsGoal.create({
            data: {
                userId,
                name: dto.name,
                targetAmount: dto.targetAmount,
                targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
            },
        });
        return this.withProgressSummary(goal);
    }
    async update(userId, goalId, dto) {
        const existingGoal = await this.findOwnedGoalOrThrow(userId, goalId);
        if (dto.targetAmount &&
            Number(dto.targetAmount) < Number(existingGoal.currentAmount)) {
            throw new common_1.BadRequestException('targetAmount cannot be lower than currentAmount');
        }
        const goal = await this.prisma.savingsGoal.update({
            where: { id: goalId },
            data: {
                name: dto.name,
                targetAmount: dto.targetAmount,
                targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
                status: dto.status,
            },
        });
        return this.withProgressSummary(goal);
    }
    async delete(userId, goalId) {
        await this.findOwnedGoalOrThrow(userId, goalId);
        await this.prisma.savingsGoal.delete({
            where: { id: goalId },
        });
        return { message: 'Savings goal deleted successfully' };
    }
    async addContribution(userId, goalId, dto) {
        const goal = await this.findOwnedGoalOrThrow(userId, goalId);
        if (goal.status === client_1.GoalStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot add contribution to a cancelled savings goal');
        }
        const nextAmount = Number(goal.currentAmount) + dto.amount;
        const nextStatus = nextAmount >= Number(goal.targetAmount) ? client_1.GoalStatus.COMPLETED : goal.status;
        const [contribution, updatedGoal] = await this.prisma.$transaction([
            this.prisma.savingsContribution.create({
                data: {
                    userId,
                    savingsGoalId: goalId,
                    amount: dto.amount,
                    note: dto.note,
                    contributedAt: new Date(dto.contributedAt),
                },
            }),
            this.prisma.savingsGoal.update({
                where: { id: goalId },
                data: {
                    currentAmount: nextAmount,
                    status: nextStatus,
                },
            }),
        ]);
        return {
            contribution,
            goal: this.withProgressSummary(updatedGoal),
        };
    }
    async findContributions(userId, goalId) {
        await this.automationsService.materializeAutoSavings(userId);
        await this.findOwnedGoalOrThrow(userId, goalId);
        return this.prisma.savingsContribution.findMany({
            where: {
                userId,
                savingsGoalId: goalId,
            },
            orderBy: {
                contributedAt: 'desc',
            },
        });
    }
    async getAutoSavingsSetting(userId, goalId) {
        await this.findOwnedGoalOrThrow(userId, goalId);
        return this.automationsService.getAutoSavingsSetting(userId, goalId);
    }
    async upsertAutoSavingsSetting(userId, goalId, dto) {
        return this.automationsService.upsertAutoSavingsSetting(userId, goalId, dto);
    }
    async findOwnedGoalOrThrow(userId, goalId) {
        const goal = await this.prisma.savingsGoal.findFirst({
            where: {
                id: goalId,
                userId,
            },
        });
        if (!goal) {
            throw new common_1.NotFoundException('Savings goal not found');
        }
        return goal;
    }
    withProgressSummary(goal) {
        const targetAmount = Number(goal.targetAmount);
        const currentAmount = Number(goal.currentAmount);
        const remainingAmount = Math.max(targetAmount - currentAmount, 0);
        const progressPercentage = targetAmount > 0
            ? Number(Math.min((currentAmount / targetAmount) * 100, 100).toFixed(2))
            : 0;
        return {
            ...goal,
            targetAmount,
            currentAmount,
            remainingAmount,
            progressPercentage,
        };
    }
};
exports.SavingsGoalsService = SavingsGoalsService;
exports.SavingsGoalsService = SavingsGoalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        automations_service_1.AutomationsService])
], SavingsGoalsService);
//# sourceMappingURL=savings-goals.service.js.map