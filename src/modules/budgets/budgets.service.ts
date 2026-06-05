import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BudgetPeriod, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { ListBudgetsQueryDto } from './dto/list-budgets-query.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: ListBudgetsQueryDto) {
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

  async findOne(userId: string, budgetId: string) {
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
      throw new NotFoundException('Budget not found');
    }

    return this.withUsageSummary(budget);
  }

  async create(userId: string, dto: CreateBudgetDto) {
    this.ensureValidDateRange(dto.startDate, dto.endDate);

    if (dto.categoryId) {
      await this.ensureExpenseCategoryCanBeUsed(userId, dto.categoryId);
    }

    const budget = await this.prisma.budget.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        name: dto.name,
        period: dto.period ?? BudgetPeriod.MONTHLY,
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

  async update(userId: string, budgetId: string, dto: UpdateBudgetDto) {
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

  async delete(userId: string, budgetId: string) {
    await this.findOwnedBudgetOrThrow(userId, budgetId);

    await this.prisma.budget.delete({
      where: { id: budgetId },
    });

    return { message: 'Budget deleted successfully' };
  }

  private async findOwnedBudgetOrThrow(userId: string, budgetId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId,
      },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }

  private async ensureExpenseCategoryCanBeUsed(userId: string, categoryId: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ userId: null }, { userId }],
      },
    });

    if (!category) {
      throw new ForbiddenException('Category cannot be used');
    }

    if (category.type !== TransactionType.EXPENSE) {
      throw new BadRequestException('Budget category must be an expense category');
    }
  }

  private ensureValidDateRange(startDate: string, endDate: string) {
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      throw new BadRequestException('startDate must be before or equal to endDate');
    }
  }

  private async withUsageSummary(budget: {
    id: string;
    userId: string;
    categoryId: string | null;
    name: string;
    period: BudgetPeriod;
    limitAmount: unknown;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    category?: unknown;
  }) {
    const spent = await this.prisma.transaction.aggregate({
      where: {
        userId: budget.userId,
        type: TransactionType.EXPENSE,
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
}
