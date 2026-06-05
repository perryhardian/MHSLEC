import { GoalStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AutomationsService } from '../automations/automations.service';
import { UpsertAutoSavingsSettingDto } from '../automations/dto/upsert-auto-savings-setting.dto';
import { AddSavingsContributionDto } from './dto/add-savings-contribution.dto';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { ListSavingsGoalsQueryDto } from './dto/list-savings-goals-query.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
export declare class SavingsGoalsService {
    private readonly prisma;
    private readonly automationsService;
    constructor(prisma: PrismaService, automationsService: AutomationsService);
    findAll(userId: string, query: ListSavingsGoalsQueryDto): Promise<{
        targetAmount: number;
        currentAmount: number;
        remainingAmount: number;
        progressPercentage: number;
        id: string;
        userId: string;
        name: string;
        targetDate: Date | null;
        status: GoalStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(userId: string, goalId: string): Promise<{
        targetAmount: number;
        currentAmount: number;
        remainingAmount: number;
        progressPercentage: number;
        id: string;
        userId: string;
        name: string;
        targetDate: Date | null;
        status: GoalStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(userId: string, dto: CreateSavingsGoalDto): Promise<{
        targetAmount: number;
        currentAmount: number;
        remainingAmount: number;
        progressPercentage: number;
        id: string;
        userId: string;
        name: string;
        targetDate: Date | null;
        status: GoalStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(userId: string, goalId: string, dto: UpdateSavingsGoalDto): Promise<{
        targetAmount: number;
        currentAmount: number;
        remainingAmount: number;
        progressPercentage: number;
        id: string;
        userId: string;
        name: string;
        targetDate: Date | null;
        status: GoalStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(userId: string, goalId: string): Promise<{
        message: string;
    }>;
    addContribution(userId: string, goalId: string, dto: AddSavingsContributionDto): Promise<{
        contribution: {
            id: string;
            createdAt: Date;
            userId: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            savingsGoalId: string;
            note: string | null;
            contributedAt: Date;
            generatedForDate: Date | null;
            autoSavingsSettingId: string | null;
        };
        goal: {
            targetAmount: number;
            currentAmount: number;
            remainingAmount: number;
            progressPercentage: number;
            id: string;
            userId: string;
            name: string;
            targetDate: Date | null;
            status: GoalStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findContributions(userId: string, goalId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        savingsGoalId: string;
        note: string | null;
        contributedAt: Date;
        generatedForDate: Date | null;
        autoSavingsSettingId: string | null;
    }[]>;
    getAutoSavingsSetting(userId: string, goalId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        savingsGoalId: string;
        isActive: boolean;
    } | null>;
    upsertAutoSavingsSetting(userId: string, goalId: string, dto: UpsertAutoSavingsSettingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        savingsGoalId: string;
        isActive: boolean;
    }>;
    private findOwnedGoalOrThrow;
    private withProgressSummary;
}
