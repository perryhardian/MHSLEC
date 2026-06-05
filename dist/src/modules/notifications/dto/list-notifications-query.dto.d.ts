import { NotificationStatus, NotificationType } from '@prisma/client';
export declare class ListNotificationsQueryDto {
    status?: NotificationStatus;
    type?: NotificationType;
}
