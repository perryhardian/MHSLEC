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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMonthlyReport(userId, query) {
        const now = new Date();
        const month = query.month ?? now.getMonth() + 1;
        const year = query.year ?? now.getFullYear();
        if (month < 1 || month > 12) {
            throw new common_1.BadRequestException('month must be between 1 and 12');
        }
        const { startDate, endDate } = this.getMonthRange(month, year);
        const [income, expense, transactions, incomeByCategory, expenseByCategory, budgets, savingsGoals, healthSnapshot,] = await Promise.all([
            this.sumTransactions(userId, client_1.TransactionType.INCOME, startDate, endDate),
            this.sumTransactions(userId, client_1.TransactionType.EXPENSE, startDate, endDate),
            this.prisma.transaction.findMany({
                where: {
                    userId,
                    transactionAt: { gte: startDate, lte: endDate },
                },
                include: { category: true },
                orderBy: { transactionAt: 'desc' },
            }),
            this.groupTransactionsByCategory(userId, client_1.TransactionType.INCOME, startDate, endDate),
            this.groupTransactionsByCategory(userId, client_1.TransactionType.EXPENSE, startDate, endDate),
            this.prisma.budget.findMany({
                where: {
                    userId,
                    startDate: { lte: endDate },
                    endDate: { gte: startDate },
                },
                include: { category: true },
                orderBy: { startDate: 'asc' },
            }),
            this.prisma.savingsGoal.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.financialHealthSnapshot.findUnique({
                where: {
                    userId_month_year: {
                        userId,
                        month,
                        year,
                    },
                },
            }),
        ]);
        const totalIncome = Number(income._sum.amount ?? 0);
        const totalExpense = Number(expense._sum.amount ?? 0);
        const remainingMoney = totalIncome - totalExpense;
        const budgetPerformance = await Promise.all(budgets.map((budget) => this.getBudgetPerformance(budget)));
        const savingsProgress = savingsGoals.map((goal) => this.withSavingsProgress(goal));
        return {
            period: { month, year, startDate, endDate },
            summary: {
                totalIncome,
                totalExpense,
                remainingMoney,
                transactionCount: transactions.length,
            },
            financialHealthSnapshot: healthSnapshot
                ? {
                    ...healthSnapshot,
                    totalIncome: Number(healthSnapshot.totalIncome),
                    totalExpense: Number(healthSnapshot.totalExpense),
                    remainingMoney: Number(healthSnapshot.remainingMoney),
                    savingsProgressRate: Number(healthSnapshot.savingsProgressRate),
                }
                : null,
            incomeByCategory,
            expenseByCategory,
            budgetPerformance,
            savingsProgress,
            transactions,
        };
    }
    sumTransactions(userId, type, startDate, endDate) {
        return this.prisma.transaction.aggregate({
            where: {
                userId,
                type,
                transactionAt: { gte: startDate, lte: endDate },
            },
            _sum: { amount: true },
        });
    }
    async groupTransactionsByCategory(userId, type, startDate, endDate) {
        const grouped = await this.prisma.transaction.groupBy({
            by: ['categoryId'],
            where: {
                userId,
                type,
                transactionAt: { gte: startDate, lte: endDate },
            },
            _sum: { amount: true },
            _count: { id: true },
            orderBy: { _sum: { amount: 'desc' } },
        });
        const categories = await this.prisma.category.findMany({
            where: { id: { in: grouped.map((item) => item.categoryId) } },
        });
        return grouped.map((item) => {
            const category = categories.find((value) => value.id === item.categoryId);
            return {
                categoryId: item.categoryId,
                categoryName: category?.name ?? 'Unknown',
                amount: Number(item._sum.amount ?? 0),
                transactionCount: item._count.id,
            };
        });
    }
    async getBudgetPerformance(budget) {
        const spent = await this.prisma.transaction.aggregate({
            where: {
                userId: budget.userId,
                type: client_1.TransactionType.EXPENSE,
                categoryId: budget.categoryId ?? undefined,
                transactionAt: { gte: budget.startDate, lte: budget.endDate },
            },
            _sum: { amount: true },
        });
        const limitAmount = Number(budget.limitAmount);
        const spentAmount = Number(spent._sum.amount ?? 0);
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
    withSavingsProgress(goal) {
        const targetAmount = Number(goal.targetAmount);
        const currentAmount = Number(goal.currentAmount);
        return {
            ...goal,
            targetAmount,
            currentAmount,
            remainingAmount: Math.max(targetAmount - currentAmount, 0),
            progressPercentage: targetAmount > 0
                ? Number(Math.min((currentAmount / targetAmount) * 100, 100).toFixed(2))
                : 0,
        };
    }
    getMonthRange(month, year) {
        return {
            startDate: new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)),
            endDate: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)),
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map