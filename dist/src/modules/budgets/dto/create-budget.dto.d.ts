import { BudgetPeriod } from '@prisma/client';
export declare class CreateBudgetDto {
    name: string;
    categoryId?: string;
    period?: BudgetPeriod;
    limitAmount: number;
    startDate: string;
    endDate: string;
}
