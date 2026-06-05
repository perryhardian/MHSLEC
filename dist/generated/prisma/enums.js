"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationStatus = exports.NotificationType = exports.GoalStatus = exports.BudgetPeriod = exports.CategoryKind = exports.TransactionType = exports.UserRole = void 0;
exports.UserRole = {
    STUDENT: 'STUDENT',
    ADMIN: 'ADMIN'
};
exports.TransactionType = {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE'
};
exports.CategoryKind = {
    DEFAULT: 'DEFAULT',
    CUSTOM: 'CUSTOM'
};
exports.BudgetPeriod = {
    MONTHLY: 'MONTHLY',
    WEEKLY: 'WEEKLY'
};
exports.GoalStatus = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};
exports.NotificationType = {
    BUDGET_WARNING: 'BUDGET_WARNING',
    BUDGET_EXCEEDED: 'BUDGET_EXCEEDED',
    SAVINGS_REMINDER: 'SAVINGS_REMINDER',
    MONTHLY_REPORT: 'MONTHLY_REPORT',
    GENERAL: 'GENERAL'
};
exports.NotificationStatus = {
    UNREAD: 'UNREAD',
    READ: 'READ'
};
//# sourceMappingURL=enums.js.map