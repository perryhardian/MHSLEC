import { TransactionType } from '@prisma/client';
export declare class UpsertDailyExpenseSettingDto {
    categoryId: string;
    type?: TransactionType;
    amount: number;
    title?: string;
    startDate: string;
    isActive?: boolean;
}
