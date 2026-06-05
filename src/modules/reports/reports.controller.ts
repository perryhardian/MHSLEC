import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { MonthlyReportQueryDto } from './dto/monthly-report-query.dto';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  getMonthlyReport(
    @CurrentUser() user: AuthUser,
    @Query() query: MonthlyReportQueryDto,
  ) {
    return this.reportsService.getMonthlyReport(user.id, query);
  }
}
