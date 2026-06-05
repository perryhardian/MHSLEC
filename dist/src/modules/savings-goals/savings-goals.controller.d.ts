import type { AuthUser } from '../auth/types/auth-user.type';
import { UpsertAutoSavingsSettingDto } from '../automations/dto/upsert-auto-savings-setting.dto';
import { AddSavingsContributionDto } from './dto/add-savings-contribution.dto';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { ListSavingsGoalsQueryDto } from './dto/list-savings-goals-query.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
import { SavingsGoalsService } from './savings-goals.service';
export declare class SavingsGoalsController {
    private readonly savingsGoalsService;
    constructor(savingsGoalsService: SavingsGoalsService);
    findAll(user: AuthUser, query: ListSavingsGoalsQueryDto): Promise<{
        targetAmount: number;
        currentAmount: number;
        remainingAmount: number;
        progressPercentage: number;
        id: string;
        userId: string;
        name: string;
        targetDate: Date | null;
        status: import("@prisma/client").GoalStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(user: AuthUser, id: string): Promise<{
        targetAmount: number;
        currentAmount: number;
        remainingAmount: number;
        progressPercentage: number;
        id: string;
        userId: string;
        name: string;
        targetDate: Date | null;
        status: import("@prisma/client").GoalStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(user: AuthUser, dto: CreateSavingsGoalDto): Promise<{
        targetAmount: number;
        currentAmount: number;
        remainingAmount: number;
        progressPercentage: number;
        id: string;
        userId: string;
        name: string;
        targetDate: Date | null;
        status: import("@prisma/client").GoalStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(user: AuthUser, id: string, dto: UpdateSavingsGoalDto): Promise<{
        targetAmount: number;
        currentAmount: number;
        remainingAmount: number;
        progressPercentage: number;
        id: string;
        userId: string;
        name: string;
        targetDate: Date | null;
        status: import("@prisma/client").GoalStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(user: AuthUser, id: string): Promise<{
        message: string;
    }>;
    findContributions(user: AuthUser, id: string): Promise<{
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
    getAutoSavingsSetting(user: AuthUser, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        savingsGoalId: string;
        isActive: boolean;
    } | null>;
    upsertAutoSavingsSetting(user: AuthUser, id: string, dto: UpsertAutoSavingsSettingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        savingsGoalId: string;
        isActive: boolean;
    }>;
    addContribution(user: AuthUser, id: string, dto: AddSavingsContributionDto): Promise<{
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
            status: import("@prisma/client").GoalStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
