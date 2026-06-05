import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MonthlyReportQueryDto } from './dto/monthly-report-query.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthlyReport(userId: string, query: MonthlyReportQueryDto) {
    const now = new Date();
    const month = query.month ?? now.getMonth() + 1;
    const year = query.year ?? now.getFullYear();

    if (month < 1 || month > 12) {
      throw new BadRequestException('month must be between 1 and 12');
    }

    const { startDate, endDate } = this.getMonthRange(month, year);
    const [
      income,
      expense,
      transactions,
      incomeByCategory,
      expenseByCategory,
      budgets,
      savingsGoals,
      healthSnapshot,
    ] = await Promise.all([
      this.sumTransactions(userId, TransactionType.INCOME, startDate, endDate),
      this.sumTransactions(userId, TransactionType.EXPENSE, startDate, endDate),
      this.prisma.transaction.findMany({
        where: {
          userId,
          transactionAt: { gte: startDate, lte: endDate },
        },
        include: { category: true },
        orderBy: { transactionAt: 'desc' },
      }),
      this.groupTransactionsByCategory(
        userId,
        TransactionType.INCOME,
        startDate,
        endDate,
      ),
      this.groupTransactionsByCategory(
        userId,
        TransactionType.EXPENSE,
        startDate,
        endDate,
      ),
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
    const budgetPerformance = await Promise.all(
      budgets.map((budget) => this.getBudgetPerformance(budget)),
    );
    const savingsProgress = savingsGoals.map((goal) =>
      this.withSavingsProgress(goal),
    );

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

  private async groupTransactionsByCategory(
    userId: string,
    type: TransactionType,
    startDate: Date,
    endDate: Date,
  ) {
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

  private async getBudgetPerformance(budget: {
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

  private getMonthRange(month: number, year: number) {
    return {
      startDate: new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)),
      endDate: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)),
    };
  }
}
