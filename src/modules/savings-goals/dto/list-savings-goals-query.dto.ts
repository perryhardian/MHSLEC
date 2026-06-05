import { IsEnum, IsOptional } from 'class-validator';
import { GoalStatus } from '@prisma/client';

export class ListSavingsGoalsQueryDto {
  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;
}
