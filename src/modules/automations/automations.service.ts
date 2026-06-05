import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoalStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpsertAutoSavingsSettingDto } from './dto/upsert-auto-savings-setting.dto';
import { UpsertDailyExpenseSettingDto } from './dto/upsert-daily-expense-setting.dto';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class AutomationsService {
  constructor(private readonly prisma: PrismaService) {}

  getDailyExpenseSetting(userId: string) {
    return this.prisma.dailyExpenseSetting.findUnique({
      where: { userId },
      include: { category: true },
    });
  }

  async upsertDailyExpenseSetting(
    userId: string,
    dto: UpsertDailyExpenseSettingDto,
  ) {
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

  async materializeDailyExpenses(userId: string) {
    const today = this.startOfUtcDay(await this.getReferenceDate(userId));

    await this.materializeDailyExpensesForRange(userId, new Date(0), today);
  }

  async materializeDailyExpensesForRange(
    userId: string,
    fromDate: Date,
    toDate: Date,
  ) {
    const setting = await this.prisma.dailyExpenseSetting.findUnique({
      where: { userId },
      include: { category: true },
    });

    if (!setting || !setting.isActive) {
      return;
    }

    const startDate = this.maxDate(
      this.startOfUtcDay(setting.startDate),
      this.startOfUtcDay(fromDate),
    );
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

  getAutoSavingsSetting(userId: string, savingsGoalId: string) {
    return this.prisma.autoSavingsSetting.findFirst({
      where: { userId, savingsGoalId },
    });
  }

  async upsertAutoSavingsSetting(
    userId: string,
    savingsGoalId: string,
    dto: UpsertAutoSavingsSettingDto,
  ) {
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

  async materializeAutoSavings(userId: string) {
    const today = this.startOfUtcDay(await this.getReferenceDate(userId));

    await this.materializeAutoSavingsForRange(userId, new Date(0), today);
  }

  async materializeAutoSavingsForRange(
    userId: string,
    fromDate: Date,
    toDate: Date,
  ) {
    const settings = await this.prisma.autoSavingsSetting.findMany({
      where: {
        userId,
        isActive: true,
        savingsGoal: {
          status: GoalStatus.ACTIVE,
        },
      },
      include: { savingsGoal: true },
    });

    const rangeStartDate = this.startOfUtcDay(fromDate);
    const rangeEndDate = this.startOfUtcDay(toDate);

    for (const setting of settings) {
      const startDate = this.maxDate(
        this.startOfUtcDay(setting.startDate),
        rangeStartDate,
      );

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

        if (!currentGoal || currentGoal.status !== GoalStatus.ACTIVE) {
          break;
        }

        const remainingAmount =
          Number(currentGoal.targetAmount) - Number(currentGoal.currentAmount);

        if (remainingAmount <= 0) {
          await this.prisma.savingsGoal.update({
            where: { id: currentGoal.id },
            data: { status: GoalStatus.COMPLETED },
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
              status:
                nextAmount >= Number(currentGoal.targetAmount)
                  ? GoalStatus.COMPLETED
                  : currentGoal.status,
            },
          });
        });
      }
    }
  }

  private async ensureCategoryCanBeUsed(
    userId: string,
    categoryId: string,
    transactionType?: TransactionType,
  ) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        type: transactionType,
        OR: [{ userId: null }, { userId }],
      },
    });

    if (!category) {
      throw new ForbiddenException('Category cannot be used');
    }
  }

  private async ensureSavingsGoalCanBeUsed(userId: string, goalId: string) {
    const goal = await this.prisma.savingsGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundException('Savings goal not found');
    }

    if (goal.status === GoalStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot automate a cancelled savings goal',
      );
    }
  }

  private eachDate(startDate: Date, endDate: Date) {
    const dates: Date[] = [];
    let cursor = this.startOfUtcDay(startDate);
    const end = this.startOfUtcDay(endDate);

    while (cursor.getTime() <= end.getTime()) {
      dates.push(cursor);
      cursor = new Date(cursor.getTime() + DAY_IN_MS);
    }

    return dates;
  }

  private startOfUtcDay(date: Date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  private maxDate(first: Date, second: Date) {
    return first.getTime() >= second.getTime() ? first : second;
  }

  private async getReferenceDate(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { timeSkipDays: true },
    });

    return new Date(Date.now() + (user?.timeSkipDays ?? 0) * DAY_IN_MS);
  }
}
