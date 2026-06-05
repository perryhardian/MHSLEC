import type { AuthUser } from '../auth/types/auth-user.type';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: AuthUser, query: ListNotificationsQueryDto): import("@prisma/client").Prisma.PrismaPromise<{
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
    generate(user: AuthUser): Promise<{
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
    markAllAsRead(user: AuthUser): Promise<{
        message: string;
    }>;
    markAsRead(user: AuthUser, id: string): Promise<{
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
    delete(user: AuthUser, id: string): Promise<{
        message: string;
    }>;
}
