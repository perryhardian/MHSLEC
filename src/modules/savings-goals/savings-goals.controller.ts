import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { UpsertAutoSavingsSettingDto } from '../automations/dto/upsert-auto-savings-setting.dto';
import { AddSavingsContributionDto } from './dto/add-savings-contribution.dto';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { ListSavingsGoalsQueryDto } from './dto/list-savings-goals-query.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
import { SavingsGoalsService } from './savings-goals.service';

@UseGuards(JwtAuthGuard)
@Controller('savings-goals')
export class SavingsGoalsController {
  constructor(private readonly savingsGoalsService: SavingsGoalsService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: ListSavingsGoalsQueryDto,
  ) {
    return this.savingsGoalsService.findAll(user.id, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.savingsGoalsService.findOne(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateSavingsGoalDto) {
    return this.savingsGoalsService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateSavingsGoalDto,
  ) {
    return this.savingsGoalsService.update(user.id, id, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.savingsGoalsService.delete(user.id, id);
  }

  @Get(':id/contributions')
  findContributions(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.savingsGoalsService.findContributions(user.id, id);
  }

  @Get(':id/auto-contribution')
  getAutoSavingsSetting(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.savingsGoalsService.getAutoSavingsSetting(user.id, id);
  }

  @Patch(':id/auto-contribution')
  upsertAutoSavingsSetting(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpsertAutoSavingsSettingDto,
  ) {
    return this.savingsGoalsService.upsertAutoSavingsSetting(user.id, id, dto);
  }

  @Post(':id/contributions')
  addContribution(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: AddSavingsContributionDto,
  ) {
    return this.savingsGoalsService.addContribution(user.id, id, dto);
  }
}
