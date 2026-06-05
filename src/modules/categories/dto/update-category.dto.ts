import { IsEnum, IsHexColor, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}
