import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSavingsGoalDto {
  @IsString()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  targetAmount: number;

  @IsOptional()
  @IsDateString()
  targetDate?: string;
}
