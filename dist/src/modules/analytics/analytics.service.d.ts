import { PrismaService } from '../../prisma/prisma.service';
import { AutomationsService } from '../automations/automations.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
export declare class AnalyticsService {
    private readonly prisma;
    private readonly automationsService;
    constructor(prisma: PrismaService, automationsService: AutomationsService);
    getDashboard(userId: string, query: DashboardQueryDto): Promise<{
        period: {
            month: number;
            year: number;
            currentDate: Date;
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalIncome: number;
            totalExpense: number;
            remainingMoney: number;
        };
        financialHealthScore: {
            score: number;
            breakdown: {
                dailyCapacityScore: number;
                budgetScore: number;
                currentMoney: number;
                remainingDays: number;
                availableDailyMoney: number;
                expectedDailySpend: number | null;
                dailyShortage: number;
                dailyShortageRate: number;
                needsExpectedDailySpendInput: boolean;
            };
            label: string;
        };
        budgets: {
            limitAmount: number;
            spentAmount: number;
            remainingAmount: number;
            usagePercentage: number;
            isExceeded: boolean;
            id: string;
            userId: string;
            categoryId: string | null;
            name: string;
            startDate: Date;
            endDate: Date;
            category?: unknown;
        }[];
        savingsGoals: {
            targetAmount: number;
            currentAmount: number;
            remainingAmount: number;
            progressPercentage: number;
        }[];
        savingsSummary: {
            totalTargetAmount: number;
            totalCurrentAmount: number;
            averageProgressPercentage: number;
            goalsCount: number;
        };
        expenseByCategory: {
            categoryId: string;
            categoryName: string;
            amount: number;
        }[];
        recentTransactions: ({
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
    }>;
    private sumTransactions;
    private getBudgetSummary;
    private getExpenseByCategory;
    private getSavingsSummary;
    private withSavingsProgress;
    private calculateFinancialHealthScore;
    private upsertFinancialHealthSnapshot;
    private getMonthRange;
    private getRemainingDaysInMonth;
    private getReferenceDate;
}
