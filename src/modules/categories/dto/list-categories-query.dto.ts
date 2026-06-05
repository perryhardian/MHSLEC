import { IsEnum, IsOptional } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class ListCategoriesQueryDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
