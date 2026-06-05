import { TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAvailableForUser(userId: string, type?: TransactionType): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        type: import("@prisma/client").$Enums.TransactionType;
        kind: import("@prisma/client").$Enums.CategoryKind;
        icon: string | null;
        color: string | null;
    }[]>;
    createCustom(userId: string, dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        type: import("@prisma/client").$Enums.TransactionType;
        kind: import("@prisma/client").$Enums.CategoryKind;
        icon: string | null;
        color: string | null;
    }>;
    updateCustom(userId: string, categoryId: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        type: import("@prisma/client").$Enums.TransactionType;
        kind: import("@prisma/client").$Enums.CategoryKind;
        icon: string | null;
        color: string | null;
    }>;
    deleteCustom(userId: string, categoryId: string): Promise<{
        message: string;
    }>;
    private findOwnedCategoryOrThrow;
    private ensureNameIsAvailable;
}
