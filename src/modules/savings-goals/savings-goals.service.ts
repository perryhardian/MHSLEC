import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GoalStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AutomationsService } from '../automations/automations.service';
import { UpsertAutoSavingsSettingDto } from '../automations/dto/upsert-auto-savings-setting.dto';
import { AddSavingsContributionDto } from './dto/add-savings-contribution.dto';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { ListSavingsGoalsQueryDto } from './dto/list-savings-goals-query.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';

@Injectable()
export class SavingsGoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly automationsService: AutomationsService,
  ) {}

  async findAll(userId: string, query: ListSavingsGoalsQueryDto) {
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

  async findOne(userId: string, goalId: string) {
    await this.automationsService.materializeAutoSavings(userId);
    const goal = await this.findOwnedGoalOrThrow(userId, goalId);
    return this.withProgressSummary(goal);
  }

  async create(userId: string, dto: CreateSavingsGoalDto) {
    if (dto.targetDate && new Date(dto.targetDate).getTime() < Date.now()) {
      throw new BadRequestException('targetDate should be in the future');
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

  async update(userId: string, goalId: string, dto: UpdateSavingsGoalDto) {
    const existingGoal = await this.findOwnedGoalOrThrow(userId, goalId);

    if (
      dto.targetAmount &&
      Number(dto.targetAmount) < Number(existingGoal.currentAmount)
    ) {
      throw new BadRequestException(
        'targetAmount cannot be lower than currentAmount',
      );
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

  async delete(userId: string, goalId: string) {
    await this.findOwnedGoalOrThrow(userId, goalId);

    await this.prisma.savingsGoal.delete({
      where: { id: goalId },
    });

    return { message: 'Savings goal deleted successfully' };
  }

  async addContribution(
    userId: string,
    goalId: string,
    dto: AddSavingsContributionDto,
  ) {
    const goal = await this.findOwnedGoalOrThrow(userId, goalId);

    if (goal.status === GoalStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot add contribution to a cancelled savings goal',
      );
    }

    const nextAmount = Number(goal.currentAmount) + dto.amount;
    const nextStatus =
      nextAmount >= Number(goal.targetAmount) ? GoalStatus.COMPLETED : goal.status;

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

  async findContributions(userId: string, goalId: string) {
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

  async getAutoSavingsSetting(userId: string, goalId: string) {
    await this.findOwnedGoalOrThrow(userId, goalId);
    return this.automationsService.getAutoSavingsSetting(userId, goalId);
  }

  async upsertAutoSavingsSetting(
    userId: string,
    goalId: string,
    dto: UpsertAutoSavingsSettingDto,
  ) {
    return this.automationsService.upsertAutoSavingsSetting(userId, goalId, dto);
  }

  private async findOwnedGoalOrThrow(userId: string, goalId: string) {
    const goal = await this.prisma.savingsGoal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!goal) {
      throw new NotFoundException('Savings goal not found');
    }

    return goal;
  }

  private withProgressSummary(goal: {
    id: string;
    userId: string;
    name: string;
    targetAmount: unknown;
    currentAmount: unknown;
    targetDate: Date | null;
    status: GoalStatus;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const targetAmount = Number(goal.targetAmount);
    const currentAmount = Number(goal.currentAmount);
    const remainingAmount = Math.max(targetAmount - currentAmount, 0);
    const progressPercentage =
      targetAmount > 0
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
}
