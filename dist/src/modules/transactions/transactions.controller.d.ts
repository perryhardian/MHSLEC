import type { AuthUser } from '../auth/types/auth-user.type';
import { UpsertDailyExpenseSettingDto } from '../automations/dto/upsert-daily-expense-setting.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    findAll(user: AuthUser, query: ListTransactionsQueryDto): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string | null;
                type: import("@prisma/client").$Enums.TransactionType;
                kind: import("@prisma/client").$Enums.CategoryKind;
                icon: string | null;
                color: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            type: import("@prisma/client").$Enums.TransactionType;
            categoryId: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            title: string;
            description: string | null;
            transactionAt: Date;
            attachmentUrl: string | null;
            dailyExpenseSettingId: string | null;
            generatedForDate: Date | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getDailyExpenseSetting(user: AuthUser): import("@prisma/client").Prisma.Prisma__DailyExpenseSettingClient<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            type: import("@prisma/client").$Enums.TransactionType;
            kind: import("@prisma/client").$Enums.CategoryKind;
            icon: string | null;
            color: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        startDate: Date;
        isActive: boolean;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    upsertDailyExpenseSetting(user: AuthUser, dto: UpsertDailyExpenseSettingDto): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            type: import("@prisma/client").$Enums.TransactionType;
            kind: import("@prisma/client").$Enums.CategoryKind;
            icon: string | null;
            color: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        startDate: Date;
        isActive: boolean;
    }>;
    findOne(user: AuthUser, id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            type: import("@prisma/client").$Enums.TransactionType;
            kind: import("@prisma/client").$Enums.CategoryKind;
            icon: string | null;
            color: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        description: string | null;
        transactionAt: Date;
        attachmentUrl: string | null;
        dailyExpenseSettingId: string | null;
        generatedForDate: Date | null;
    }>;
    create(user: AuthUser, dto: CreateTransactionDto): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            type: import("@prisma/client").$Enums.TransactionType;
            kind: import("@prisma/client").$Enums.CategoryKind;
            icon: string | null;
            color: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        description: string | null;
        transactionAt: Date;
        attachmentUrl: string | null;
        dailyExpenseSettingId: string | null;
        generatedForDate: Date | null;
    }>;
    update(user: AuthUser, id: string, dto: UpdateTransactionDto): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            type: import("@prisma/client").$Enums.TransactionType;
            kind: import("@prisma/client").$Enums.CategoryKind;
            icon: string | null;
            color: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.TransactionType;
        categoryId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        title: string;
        description: string | null;
        transactionAt: Date;
        attachmentUrl: string | null;
        dailyExpenseSettingId: string | null;
        generatedForDate: Date | null;
    }>;
    delete(user: AuthUser, id: string): Promise<{
        message: string;
    }>;
}
