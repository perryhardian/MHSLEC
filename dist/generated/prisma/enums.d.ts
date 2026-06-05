export declare const UserRole: {
    readonly STUDENT: "STUDENT";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const TransactionType: {
    readonly INCOME: "INCOME";
    readonly EXPENSE: "EXPENSE";
};
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
export declare const CategoryKind: {
    readonly DEFAULT: "DEFAULT";
    readonly CUSTOM: "CUSTOM";
};
export type CategoryKind = (typeof CategoryKind)[keyof typeof CategoryKind];
export declare const BudgetPeriod: {
    readonly MONTHLY: "MONTHLY";
    readonly WEEKLY: "WEEKLY";
};
export type BudgetPeriod = (typeof BudgetPeriod)[keyof typeof BudgetPeriod];
export declare const GoalStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type GoalStatus = (typeof GoalStatus)[keyof typeof GoalStatus];
export declare const NotificationType: {
    readonly BUDGET_WARNING: "BUDGET_WARNING";
    readonly BUDGET_EXCEEDED: "BUDGET_EXCEEDED";
    readonly SAVINGS_REMINDER: "SAVINGS_REMINDER";
    readonly MONTHLY_REPORT: "MONTHLY_REPORT";
    readonly GENERAL: "GENERAL";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export declare const NotificationStatus: {
    readonly UNREAD: "UNREAD";
    readonly READ: "READ";
};
export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];
