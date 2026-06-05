import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AddSavingsContributionDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsDateString()
  contributedAt: string;
}
