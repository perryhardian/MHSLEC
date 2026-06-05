import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { AnalyticsService } from './analytics.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(
    @CurrentUser() user: AuthUser,
    @Query() query: DashboardQueryDto,
  ) {
    return this.analyticsService.getDashboard(user.id, query);
  }
}
