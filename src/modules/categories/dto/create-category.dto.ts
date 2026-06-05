import { IsEnum, IsHexColor, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}
