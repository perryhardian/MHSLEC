import { IsBoolean, IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpsertAutoSavingsSettingDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
