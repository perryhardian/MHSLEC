import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AutomationsService } from '../automations/automations.service';
import { UpsertDailyExpenseSettingDto } from '../automations/dto/upsert-daily-expense-setting.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly automationsService: AutomationsService,
  ) {}

  async findAll(userId: string, query: ListTransactionsQueryDto) {
    await this.automationsService.materializeDailyExpenses(userId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      type: query.type,
      categoryId: query.categoryId,
      transactionAt: {
        gte: query.startDate ? new Date(query.startDate) : undefined,
        lte: query.endDate ? new Date(query.endDate) : undefined,
      },
    };

    const [items, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: [{ transactionAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async create(userId: string, dto: CreateTransactionDto) {
    await this.ensureCategoryCanBeUsed(userId, dto.categoryId, dto.type);

    return this.prisma.transaction.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        type: dto.type,
        amount: dto.amount,
        title: dto.title,
        description: dto.description,
        transactionAt: new Date(dto.transactionAt),
        attachmentUrl: dto.attachmentUrl,
      },
      include: {
        category: true,
      },
    });
  }

  async update(userId: string, transactionId: string, dto: UpdateTransactionDto) {
    const transaction = await this.findOne(userId, transactionId);
    const nextType = dto.type ?? transaction.type;
    const nextCategoryId = dto.categoryId ?? transaction.categoryId;

    if (dto.type || dto.categoryId) {
      await this.ensureCategoryCanBeUsed(userId, nextCategoryId, nextType);
    }

    return this.prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        categoryId: dto.categoryId,
        type: dto.type,
        amount: dto.amount,
        title: dto.title,
        description: dto.description,
        transactionAt: dto.transactionAt ? new Date(dto.transactionAt) : undefined,
        attachmentUrl: dto.attachmentUrl,
      },
      include: {
        category: true,
      },
    });
  }

  async delete(userId: string, transactionId: string) {
    await this.findOne(userId, transactionId);

    await this.prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    return { message: 'Transaction deleted successfully' };
  }

  getDailyExpenseSetting(userId: string) {
    return this.automationsService.getDailyExpenseSetting(userId);
  }

  upsertDailyExpenseSetting(
    userId: string,
    dto: UpsertDailyExpenseSettingDto,
  ) {
    return this.automationsService.upsertDailyExpenseSetting(userId, dto);
  }

  private async ensureCategoryCanBeUsed(
    userId: string,
    categoryId: string,
    transactionType: TransactionType,
  ) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ userId: null }, { userId }],
      },
    });

    if (!category) {
      throw new ForbiddenException('Category cannot be used');
    }

    if (category.type !== transactionType) {
      throw new BadRequestException(
        'Category type must match transaction type',
      );
    }
  }
}
