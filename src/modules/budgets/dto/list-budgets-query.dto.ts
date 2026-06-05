import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { BudgetPeriod } from '@prisma/client';

export class ListBudgetsQueryDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(BudgetPeriod)
  period?: BudgetPeriod;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
