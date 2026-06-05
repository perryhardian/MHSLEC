import type { AuthUser } from '../auth/types/auth-user.type';
import { MonthlyReportQueryDto } from './dto/monthly-report-query.dto';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getMonthlyReport(user: AuthUser, query: MonthlyReportQueryDto): Promise<{
        period: {
            month: number;
            year: number;
            startDate: Date;
            endDate: Date;
        };
        summary: {
            totalIncome: number;
            totalExpense: number;
            remainingMoney: number;
            transactionCount: number;
        };
        financialHealthSnapshot: {
            totalIncome: number;
            totalExpense: number;
            remainingMoney: number;
            savingsProgressRate: number;
            id: string;
            createdAt: Date;
            userId: string;
            score: number;
            month: number;
            year: number;
        } | null;
        incomeByCategory: {
            categoryId: string;
            categoryName: string;
            amount: number;
            transactionCount: number;
        }[];
        expenseByCategory: {
            categoryId: string;
            categoryName: string;
            amount: number;
            transactionCount: number;
        }[];
        budgetPerformance: {
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
        savingsProgress: {
            targetAmount: number;
            currentAmount: number;
            remainingAmount: number;
            progressPercentage: number;
        }[];
        transactions: ({
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
}
