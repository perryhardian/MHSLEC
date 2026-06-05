import { PrismaService } from '../../prisma/prisma.service';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, query: ListNotificationsQueryDto): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        status: import("@prisma/client").$Enums.NotificationStatus;
        message: string;
        sentAt: Date | null;
        readAt: Date | null;
    }[]>;
    markAsRead(userId: string, notificationId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        status: import("@prisma/client").$Enums.NotificationStatus;
        message: string;
        sentAt: Date | null;
        readAt: Date | null;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    delete(userId: string, notificationId: string): Promise<{
        message: string;
    }>;
    generateFinancialNotifications(userId: string): Promise<{
        created: number;
        notifications: {
            id: string;
            createdAt: Date;
            userId: string;
            type: import("@prisma/client").$Enums.NotificationType;
            title: string;
            status: import("@prisma/client").$Enums.NotificationStatus;
            message: string;
            sentAt: Date | null;
            readAt: Date | null;
        }[];
    }>;
    private generateBudgetNotifications;
    private generateSavingsNotifications;
    private createIfNotExists;
    private findOwnedNotificationOrThrow;
}
