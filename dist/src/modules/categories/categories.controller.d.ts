import type { AuthUser } from '../auth/types/auth-user.type';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ListCategoriesQueryDto } from './dto/list-categories-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAvailableForUser(user: AuthUser, query: ListCategoriesQueryDto): import("@prisma/client").Prisma.PrismaPromise<{
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
    createCustom(user: AuthUser, dto: CreateCategoryDto): Promise<{
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
    updateCustom(user: AuthUser, id: string, dto: UpdateCategoryDto): Promise<{
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
    deleteCustom(user: AuthUser, id: string): Promise<{
        message: string;
    }>;
}
