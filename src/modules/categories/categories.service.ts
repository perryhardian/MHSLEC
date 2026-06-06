import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryKind, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAvailableForUser(userId: string, type?: TransactionType) {
    const allowedExpenseNames = [
      'Kebutuhan Harian',
      'Kebutuhan Bulanan',
      'Belanja',
    ];
    const defaultCategoryFilter =
      type === TransactionType.EXPENSE
        ? { userId: null, name: { in: allowedExpenseNames } }
        : { userId: null };

    return this.prisma.category.findMany({
      where: {
        type,
        OR: [defaultCategoryFilter, { userId }],
      },
      orderBy: [{ kind: 'asc' }, { name: 'asc' }],
    });
  }

  async createCustom(userId: string, dto: CreateCategoryDto) {
    await this.ensureNameIsAvailable(userId, dto.name, dto.type);

    return this.prisma.category.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type,
        icon: dto.icon,
        color: dto.color,
        kind: CategoryKind.CUSTOM,
      },
    });
  }

  async updateCustom(userId: string, categoryId: string, dto: UpdateCategoryDto) {
    const category = await this.findOwnedCategoryOrThrow(userId, categoryId);

    if (dto.name || dto.type) {
      await this.ensureNameIsAvailable(
        userId,
        dto.name ?? category.name,
        dto.type ?? category.type,
        categoryId,
      );
    }

    return this.prisma.category.update({
      where: { id: categoryId },
      data: dto,
    });
  }

  async deleteCustom(userId: string, categoryId: string) {
    await this.findOwnedCategoryOrThrow(userId, categoryId);

    const transactionCount = await this.prisma.transaction.count({
      where: { categoryId },
    });

    if (transactionCount > 0) {
      throw new ConflictException(
        'Category cannot be deleted because it is used by transactions',
      );
    }

    await this.prisma.category.delete({
      where: { id: categoryId },
    });

    return { message: 'Category deleted successfully' };
  }

  private async findOwnedCategoryOrThrow(userId: string, categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.kind === CategoryKind.DEFAULT || category.userId !== userId) {
      throw new ForbiddenException('Only custom categories can be modified');
    }

    return category;
  }

  private async ensureNameIsAvailable(
    userId: string,
    name: string,
    type: TransactionType,
    ignoredCategoryId?: string,
  ) {
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        name,
        type,
        OR: [{ userId: null }, { userId }],
        id: ignoredCategoryId ? { not: ignoredCategoryId } : undefined,
      },
    });

    if (existingCategory) {
      throw new ConflictException('Category name is already used');
    }
  }
}
