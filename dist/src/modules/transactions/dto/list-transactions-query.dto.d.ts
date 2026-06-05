import { TransactionType } from '@prisma/client';
export declare class ListTransactionsQueryDto {
    type?: TransactionType;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
