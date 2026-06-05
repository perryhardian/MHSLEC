import { IsEnum, IsOptional } from 'class-validator';
import { NotificationStatus, NotificationType } from '@prisma/client';

export class ListNotificationsQueryDto {
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}
