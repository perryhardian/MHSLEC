import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { BudgetPeriod } from '@prisma/client';

export class CreateBudgetDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(BudgetPeriod)
  period?: BudgetPeriod;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  limitAmount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
