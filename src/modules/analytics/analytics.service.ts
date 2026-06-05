import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AutomationsService } from '../automations/automations.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly automationsService: AutomationsService,
  ) {}

  async getDashboard(userId: string, query: DashboardQueryDto) {
    await Promise.all([
      this.automationsService.materializeDailyExpenses(userId),
      this.automationsService.materializeAutoSavings(userId),
    ]);

    const now = await this.getReferenceDate(userId);
    const month = query.month ?? now.getMonth() + 1;
    const year = query.year ?? now.getFullYear();

    if (month < 1 || month > 12) {
      throw new BadRequestException('month must be between 1 and 12');
    }

    const { startDate, endDate } = this.getMonthRange(month, year);
    const [user, income, expense, recentTransactions, budgets, goals] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { expectedDailySpend: true, timeSkipDays: true },
        }),
        this.sumTransactions(userId, TransactionType.INCOME, startDate, endDate),
        this.sumTransactions(userId, TransactionType.EXPENSE, startDate, endDate),
        this.prisma.transaction.findMany({
          where: { userId, transactionAt: { gte: startDate, lte: endDate } },
          include: { category: true },
          orderBy: { transactionAt: 'desc' },
          take: 5,
        }),
        this.prisma.budget.findMany({
          where: {
            userId,
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
          include: { category: true },
          orderBy: { startDate: 'desc' },
        }),
        this.prisma.savingsGoal.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

    const totalIncome = Number(income._sum.amount ?? 0);
    const totalExpense = Number(expense._sum.amount ?? 0);
    const remainingMoney = totalIncome - totalExpense;
    const budgetSummaries = await Promise.all(
      budgets.map((budget) => this.getBudgetSummary(budget)),
    );
    const expenseByCategory = await this.getExpenseByCategory(
      userId,
      startDate,
      endDate,
    );
    const savingsSummary = this.getSavingsSummary(goals);
    const financialHealthScore = this.calculateFinancialHealthScore({
      currentMoney: remainingMoney,
      remainingDays: this.getRemainingDaysInMonth(now, month, year),
      expectedDailySpend:
        user?.expectedDailySpend === null || user?.expectedDailySpend === undefined
          ? null
          : Number(user.expectedDailySpend),
      budgetSummaries,
    });

    await this.upsertFinancialHealthSnapshot({
      userId,
      month,
      year,
      score: financialHealthScore.score,
      totalIncome,
      totalExpense,
      remainingMoney,
      savingsProgressRate: savingsSummary.averageProgressPercentage,
    });

    return {
      period: { month, year, currentDate: now, startDate, endDate },
      summary: { totalIncome, totalExpense, remainingMoney },
      financialHealthScore,
      budgets: budgetSummaries,
      savingsGoals: goals.map((goal) => this.withSavingsProgress(goal)),
      savingsSummary,
      expenseByCategory,
      recentTransactions,
    };
  }

  private sumTransactions(
    userId: string,
    type: TransactionType,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.transaction.aggregate({
      where: {
        userId,
        type,
        transactionAt: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });
  }

  private async getBudgetSummary(budget: {
    id: string;
    userId: string;
    categoryId: string | null;
    name: string;
    limitAmount: unknown;
    startDate: Date;
    endDate: Date;
    category?: unknown;
  }) {
    const spent = await this.prisma.transaction.aggregate({
      where: {
        userId: budget.userId,
        type: TransactionType.EXPENSE,
        categoryId: budget.categoryId ?? undefined,
        transactionAt: { gte: budget.startDate, lte: budget.endDate },
      },
      _sum: { amount: true },
    });
    const limitAmount = Number(budget.limitAmount);
    const spentAmount = Number(spent._sum.amount ?? 0);
    const remainingAmount = limitAmount - spentAmount;
    const usagePercentage =
      limitAmount > 0 ? Number(((spentAmount / limitAmount) * 100).toFixed(2)) : 0;

    return {
      ...budget,
      limitAmount,
      spentAmount,
      remainingAmount,
      usagePercentage,
      isExceeded: spentAmount > limitAmount,
    };
  }

  private async getExpenseByCategory(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const grouped = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: TransactionType.EXPENSE,
        transactionAt: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
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
      };
    });
  }

  private getSavingsSummary(
    goals: Array<{ targetAmount: unknown; currentAmount: unknown }>,
  ) {
    const totalTargetAmount = goals.reduce(
      (total, goal) => total + Number(goal.targetAmount),
      0,
    );
    const totalCurrentAmount = goals.reduce(
      (total, goal) => total + Number(goal.currentAmount),
      0,
    );
    const averageProgressPercentage =
      totalTargetAmount > 0
        ? Number(((totalCurrentAmount / totalTargetAmount) * 100).toFixed(2))
        : 0;

    return {
      totalTargetAmount,
      totalCurrentAmount,
      averageProgressPercentage,
      goalsCount: goals.length,
    };
  }

  private withSavingsProgress(goal: {
    targetAmount: unknown;
    currentAmount: unknown;
  }) {
    const targetAmount = Number(goal.targetAmount);
    const currentAmount = Number(goal.currentAmount);

    return {
      ...goal,
      targetAmount,
      currentAmount,
      remainingAmount: Math.max(targetAmount - currentAmount, 0),
      progressPercentage:
        targetAmount > 0
          ? Number(Math.min((currentAmount / targetAmount) * 100, 100).toFixed(2))
          : 0,
    };
  }

  private calculateFinancialHealthScore(input: {
    currentMoney: number;
    remainingDays: number;
    expectedDailySpend: number | null;
    budgetSummaries: Array<{ isExceeded: boolean }>;
  }) {
    const availableDailyMoney =
      input.remainingDays > 0 ? input.currentMoney / input.remainingDays : 0;
    const dailyShortage =
      input.expectedDailySpend === null
        ? 0
        : Math.max(input.expectedDailySpend - availableDailyMoney, 0);
    const dailyShortageRate =
      input.expectedDailySpend === null || availableDailyMoney <= 0
        ? input.expectedDailySpend === null
          ? 0
          : 1
        : dailyShortage / availableDailyMoney;
    const dailyCapacityScore =
      input.expectedDailySpend === null
        ? 0
        : Math.max(0, Math.min(70 * (1 - dailyShortageRate), 70));
    const budgetScore =
      input.budgetSummaries.length === 0
        ? 30
        : Math.max(
            0,
            30 -
              input.budgetSummaries.filter((budget) => budget.isExceeded).length *
                10,
          );
    const score = Math.round(dailyCapacityScore + budgetScore);

    return {
      score,
      breakdown: {
        dailyCapacityScore: Number(dailyCapacityScore.toFixed(2)),
        budgetScore,
        currentMoney: input.currentMoney,
        remainingDays: input.remainingDays,
        availableDailyMoney: Number(availableDailyMoney.toFixed(2)),
        expectedDailySpend: input.expectedDailySpend,
        dailyShortage: Number(dailyShortage.toFixed(2)),
        dailyShortageRate: Number(dailyShortageRate.toFixed(4)),
        needsExpectedDailySpendInput: input.expectedDailySpend === null,
      },
      label:
        score >= 80
          ? 'HEALTHY'
          : score >= 60
            ? 'STABLE'
            : score >= 40
              ? 'WARNING'
              : 'CRITICAL',
    };
  }

  private upsertFinancialHealthSnapshot(input: {
    userId: string;
    month: number;
    year: number;
    score: number;
    totalIncome: number;
    totalExpense: number;
    remainingMoney: number;
    savingsProgressRate: number;
  }) {
    return this.prisma.financialHealthSnapshot.upsert({
      where: {
        userId_month_year: {
          userId: input.userId,
          month: input.month,
          year: input.year,
        },
      },
      update: {
        score: input.score,
        totalIncome: input.totalIncome,
        totalExpense: input.totalExpense,
        remainingMoney: input.remainingMoney,
        savingsProgressRate: input.savingsProgressRate,
      },
      create: input,
    });
  }

  private getMonthRange(month: number, year: number) {
    return {
      startDate: new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)),
      endDate: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)),
    };
  }

  private getRemainingDaysInMonth(referenceDate: Date, month: number, year: number) {
    const currentMonth = referenceDate.getMonth() + 1;
    const currentYear = referenceDate.getFullYear();
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

    if (month !== currentMonth || year !== currentYear) {
      return lastDay;
    }

    return Math.max(lastDay - referenceDate.getDate() + 1, 1);
  }

  private async getReferenceDate(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { timeSkipDays: true },
    });

    return new Date(Date.now() + (user?.timeSkipDays ?? 0) * 24 * 60 * 60 * 1000);
  }
}
