import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Category: "Category";
    readonly Transaction: "Transaction";
    readonly Budget: "Budget";
    readonly SavingsGoal: "SavingsGoal";
    readonly SavingsContribution: "SavingsContribution";
    readonly Notification: "Notification";
    readonly FinancialHealthSnapshot: "FinancialHealthSnapshot";
    readonly RefreshToken: "RefreshToken";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly monthlyAllowance: "monthlyAllowance";
    readonly phoneNumber: "phoneNumber";
    readonly university: "university";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly name: "name";
    readonly type: "type";
    readonly kind: "kind";
    readonly icon: "icon";
    readonly color: "color";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const TransactionScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly categoryId: "categoryId";
    readonly type: "type";
    readonly amount: "amount";
    readonly title: "title";
    readonly description: "description";
    readonly transactionAt: "transactionAt";
    readonly attachmentUrl: "attachmentUrl";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum];
export declare const BudgetScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly categoryId: "categoryId";
    readonly name: "name";
    readonly period: "period";
    readonly limitAmount: "limitAmount";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BudgetScalarFieldEnum = (typeof BudgetScalarFieldEnum)[keyof typeof BudgetScalarFieldEnum];
export declare const SavingsGoalScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly name: "name";
    readonly targetAmount: "targetAmount";
    readonly currentAmount: "currentAmount";
    readonly targetDate: "targetDate";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SavingsGoalScalarFieldEnum = (typeof SavingsGoalScalarFieldEnum)[keyof typeof SavingsGoalScalarFieldEnum];
export declare const SavingsContributionScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly savingsGoalId: "savingsGoalId";
    readonly amount: "amount";
    readonly note: "note";
    readonly contributedAt: "contributedAt";
    readonly createdAt: "createdAt";
};
export type SavingsContributionScalarFieldEnum = (typeof SavingsContributionScalarFieldEnum)[keyof typeof SavingsContributionScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly status: "status";
    readonly title: "title";
    readonly message: "message";
    readonly sentAt: "sentAt";
    readonly readAt: "readAt";
    readonly createdAt: "createdAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const FinancialHealthSnapshotScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly score: "score";
    readonly month: "month";
    readonly year: "year";
    readonly totalIncome: "totalIncome";
    readonly totalExpense: "totalExpense";
    readonly remainingMoney: "remainingMoney";
    readonly savingsProgressRate: "savingsProgressRate";
    readonly createdAt: "createdAt";
};
export type FinancialHealthSnapshotScalarFieldEnum = (typeof FinancialHealthSnapshotScalarFieldEnum)[keyof typeof FinancialHealthSnapshotScalarFieldEnum];
export declare const RefreshTokenScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly tokenHash: "tokenHash";
    readonly expiresAt: "expiresAt";
    readonly revokedAt: "revokedAt";
    readonly createdAt: "createdAt";
};
export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
