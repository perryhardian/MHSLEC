import { IsInt, Min } from 'class-validator';

export class TimeSkipDto {
  @IsInt()
  @Min(1)
  days: number;
}
