import { BudgetPeriod } from '@prisma/client';
export declare class ListBudgetsQueryDto {
    categoryId?: string;
    period?: BudgetPeriod;
    startDate?: string;
    endDate?: string;
}
