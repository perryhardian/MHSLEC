"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(userId, query) {
        return this.prisma.notification.findMany({
            where: {
                userId,
                status: query.status,
                type: query.type,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async markAsRead(userId, notificationId) {
        await this.findOwnedNotificationOrThrow(userId, notificationId);
        return this.prisma.notification.update({
            where: { id: notificationId },
            data: {
                status: client_1.NotificationStatus.READ,
                readAt: new Date(),
            },
        });
    }
    async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
            where: {
                userId,
                status: client_1.NotificationStatus.UNREAD,
            },
            data: {
                status: client_1.NotificationStatus.READ,
                readAt: new Date(),
            },
        });
        return { message: 'All notifications marked as read' };
    }
    async delete(userId, notificationId) {
        await this.findOwnedNotificationOrThrow(userId, notificationId);
        await this.prisma.notification.delete({
            where: { id: notificationId },
        });
        return { message: 'Notification deleted successfully' };
    }
    async generateFinancialNotifications(userId) {
        const [budgetNotifications, savingsNotifications] = await Promise.all([
            this.generateBudgetNotifications(userId),
            this.generateSavingsNotifications(userId),
        ]);
        return {
            created: budgetNotifications.length + savingsNotifications.length,
            notifications: [...budgetNotifications, ...savingsNotifications],
        };
    }
    async generateBudgetNotifications(userId) {
        const now = new Date();
        const budgets = await this.prisma.budget.findMany({
            where: {
                userId,
                startDate: { lte: now },
                endDate: { gte: now },
            },
            include: {
                category: true,
            },
        });
        const createdNotifications = [];
        for (const budget of budgets) {
            const spent = await this.prisma.transaction.aggregate({
                where: {
                    userId,
                    type: client_1.TransactionType.EXPENSE,
                    categoryId: budget.categoryId ?? undefined,
                    transactionAt: {
                        gte: budget.startDate,
                        lte: budget.endDate,
                    },
                },
                _sum: { amount: true },
            });
            const spentAmount = Number(spent._sum.amount ?? 0);
            const limitAmount = Number(budget.limitAmount);
            const usagePercentage = limitAmount > 0 ? (spentAmount / limitAmount) * 100 : 0;
            if (usagePercentage < 80) {
                continue;
            }
            const type = usagePercentage >= 100
                ? client_1.NotificationType.BUDGET_EXCEEDED
                : client_1.NotificationType.BUDGET_WARNING;
            const title = usagePercentage >= 100
                ? 'Budget sudah terlampaui'
                : 'Budget hampir habis';
            const message = usagePercentage >= 100
                ? `Budget ${budget.name} sudah melewati batas.`
                : `Budget ${budget.name} sudah mencapai ${usagePercentage.toFixed(0)}%.`;
            const notification = await this.createIfNotExists(userId, {
                type,
                title,
                message,
            });
            if (notification) {
                createdNotifications.push(notification);
            }
        }
        return createdNotifications;
    }
    async generateSavingsNotifications(userId) {
        const goals = await this.prisma.savingsGoal.findMany({
            where: {
                userId,
                status: client_1.GoalStatus.ACTIVE,
            },
        });
        const createdNotifications = [];
        for (const goal of goals) {
            const targetAmount = Number(goal.targetAmount);
            const currentAmount = Number(goal.currentAmount);
            const progressPercentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
            if (progressPercentage >= 50) {
                continue;
            }
            const notification = await this.createIfNotExists(userId, {
                type: client_1.NotificationType.SAVINGS_REMINDER,
                title: 'Target tabungan perlu perhatian',
                message: `Progress tabungan ${goal.name} masih ${progressPercentage.toFixed(0)}%.`,
            });
            if (notification) {
                createdNotifications.push(notification);
            }
        }
        return createdNotifications;
    }
    async createIfNotExists(userId, data) {
        const existingNotification = await this.prisma.notification.findFirst({
            where: {
                userId,
                type: data.type,
                title: data.title,
                message: data.message,
                status: client_1.NotificationStatus.UNREAD,
            },
        });
        if (existingNotification) {
            return null;
        }
        return this.prisma.notification.create({
            data: {
                userId,
                type: data.type,
                title: data.title,
                message: data.message,
                sentAt: new Date(),
            },
        });
    }
    async findOwnedNotificationOrThrow(userId, notificationId) {
        const notification = await this.prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId,
            },
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return notification;
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map