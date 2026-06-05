import { PrismaService } from '../../prisma/prisma.service';
import { AutomationsService } from '../automations/automations.service';
import { UpsertDailyExpenseSettingDto } from '../automations/dto/upsert-daily-expense-setting.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class TransactionsService {
    private readonly prisma;
    private readonly automationsService;
    constructor(prisma: PrismaService, automationsService: AutomationsService);
    findAll(userId: string, query: ListTransactionsQueryDto): Promise<{
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
    findOne(userId: string, transactionId: string): Promise<{
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
    create(userId: string, dto: CreateTransactionDto): Promise<{
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
    update(userId: string, transactionId: string, dto: UpdateTransactionDto): Promise<{
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
    delete(userId: string, transactionId: string): Promise<{
        message: string;
    }>;
    getDailyExpenseSetting(userId: string): import("@prisma/client").Prisma.Prisma__DailyExpenseSettingClient<({
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
    upsertDailyExpenseSetting(userId: string, dto: UpsertDailyExpenseSettingDto): Promise<{
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
    private ensureCategoryCanBeUsed;
}
