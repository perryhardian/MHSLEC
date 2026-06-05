import { GoalStatus } from '@prisma/client';
export declare class UpdateSavingsGoalDto {
    name?: string;
    targetAmount?: number;
    targetDate?: string;
    status?: GoalStatus;
}
