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
import { UpsertDailyExpenseSettingDto } from '../automations/dto/upsert-daily-expense-setting.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: ListTransactionsQueryDto,
  ) {
    return this.transactionsService.findAll(user.id, query);
  }

  @Get('daily-expense-setting')
  getDailyExpenseSetting(@CurrentUser() user: AuthUser) {
    return this.transactionsService.getDailyExpenseSetting(user.id);
  }

  @Patch('daily-expense-setting')
  upsertDailyExpenseSetting(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertDailyExpenseSettingDto,
  ) {
    return this.transactionsService.upsertDailyExpenseSetting(user.id, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.transactionsService.findOne(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(user.id, id, dto);
  }

  @Delete(':id')
  delete(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.transactionsService.delete(user.id, id);
  }
}
