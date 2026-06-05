import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GoalStatus,
  Notification,
  NotificationStatus,
  NotificationType,
  TransactionType,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string, query: ListNotificationsQueryDto) {
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

  async markAsRead(userId: string, notificationId: string) {
    await this.findOwnedNotificationOrThrow(userId, notificationId);

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
      },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });

    return { message: 'All notifications marked as read' };
  }

  async delete(userId: string, notificationId: string) {
    await this.findOwnedNotificationOrThrow(userId, notificationId);

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notification deleted successfully' };
  }

  async generateFinancialNotifications(userId: string) {
    const [budgetNotifications, savingsNotifications] = await Promise.all([
      this.generateBudgetNotifications(userId),
      this.generateSavingsNotifications(userId),
    ]);

    return {
      created: budgetNotifications.length + savingsNotifications.length,
      notifications: [...budgetNotifications, ...savingsNotifications],
    };
  }

  private async generateBudgetNotifications(userId: string) {
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

    const createdNotifications: Notification[] = [];

    for (const budget of budgets) {
      const spent = await this.prisma.transaction.aggregate({
        where: {
          userId,
          type: TransactionType.EXPENSE,
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
      const usagePercentage =
        limitAmount > 0 ? (spentAmount / limitAmount) * 100 : 0;

      if (usagePercentage < 80) {
        continue;
      }

      const type =
        usagePercentage >= 100
          ? NotificationType.BUDGET_EXCEEDED
          : NotificationType.BUDGET_WARNING;
      const title =
        usagePercentage >= 100
          ? 'Budget sudah terlampaui'
          : 'Budget hampir habis';
      const message =
        usagePercentage >= 100
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

  private async generateSavingsNotifications(userId: string) {
    const goals = await this.prisma.savingsGoal.findMany({
      where: {
        userId,
        status: GoalStatus.ACTIVE,
      },
    });
    const createdNotifications: Notification[] = [];

    for (const goal of goals) {
      const targetAmount = Number(goal.targetAmount);
      const currentAmount = Number(goal.currentAmount);
      const progressPercentage =
        targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

      if (progressPercentage >= 50) {
        continue;
      }

      const notification = await this.createIfNotExists(userId, {
        type: NotificationType.SAVINGS_REMINDER,
        title: 'Target tabungan perlu perhatian',
        message: `Progress tabungan ${goal.name} masih ${progressPercentage.toFixed(
          0,
        )}%.`,
      });

      if (notification) {
        createdNotifications.push(notification);
      }
    }

    return createdNotifications;
  }

  private async createIfNotExists(
    userId: string,
    data: {
      type: NotificationType;
      title: string;
      message: string;
    },
  ) {
    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        status: NotificationStatus.UNREAD,
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

  private async findOwnedNotificationOrThrow(
    userId: string,
    notificationId: string,
  ) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }
}
