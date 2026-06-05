import { TransactionType } from '@prisma/client';
export declare class CreateTransactionDto {
    categoryId: string;
    type: TransactionType;
    amount: number;
    title: string;
    description?: string;
    transactionAt: string;
    attachmentUrl?: string;
}
