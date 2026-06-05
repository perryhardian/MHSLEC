import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class UpsertDailyExpenseSettingDto {
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
