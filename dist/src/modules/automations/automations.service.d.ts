import { PrismaService } from '../../prisma/prisma.service';
import { UpsertAutoSavingsSettingDto } from './dto/upsert-auto-savings-setting.dto';
import { UpsertDailyExpenseSettingDto } from './dto/upsert-daily-expense-setting.dto';
export declare class AutomationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    materializeDailyExpenses(userId: string): Promise<void>;
    materializeDailyExpensesForRange(userId: string, fromDate: Date, toDate: Date): Promise<void>;
    getAutoSavingsSetting(userId: string, savingsGoalId: string): import("@prisma/client").Prisma.Prisma__AutoSavingsSettingClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        savingsGoalId: string;
        isActive: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    upsertAutoSavingsSetting(userId: string, savingsGoalId: string, dto: UpsertAutoSavingsSettingDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date;
        savingsGoalId: string;
        isActive: boolean;
    }>;
    materializeAutoSavings(userId: string): Promise<void>;
    materializeAutoSavingsForRange(userId: string, fromDate: Date, toDate: Date): Promise<void>;
    private ensureCategoryCanBeUsed;
    private ensureSavingsGoalCanBeUsed;
    private eachDate;
    private startOfUtcDay;
    private maxDate;
    private getReferenceDate;
}
