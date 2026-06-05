"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAvailableForUser(userId, type) {
        const allowedExpenseNames = [
            'Kebutuhan Harian',
            'Kebutuhan Bulanan',
            'Belanja',
        ];
        return this.prisma.category.findMany({
            where: {
                type,
                name: type === client_1.TransactionType.EXPENSE ? { in: allowedExpenseNames } : undefined,
                OR: [{ userId: null }, { userId }],
            },
            orderBy: [{ kind: 'asc' }, { name: 'asc' }],
        });
    }
    async createCustom(userId, dto) {
        await this.ensureNameIsAvailable(userId, dto.name, dto.type);
        return this.prisma.category.create({
            data: {
                userId,
                name: dto.name,
                type: dto.type,
                icon: dto.icon,
                color: dto.color,
                kind: client_1.CategoryKind.CUSTOM,
            },
        });
    }
    async updateCustom(userId, categoryId, dto) {
        const category = await this.findOwnedCategoryOrThrow(userId, categoryId);
        if (dto.name || dto.type) {
            await this.ensureNameIsAvailable(userId, dto.name ?? category.name, dto.type ?? category.type, categoryId);
        }
        return this.prisma.category.update({
            where: { id: categoryId },
            data: dto,
        });
    }
    async deleteCustom(userId, categoryId) {
        await this.findOwnedCategoryOrThrow(userId, categoryId);
        const transactionCount = await this.prisma.transaction.count({
            where: { categoryId },
        });
        if (transactionCount > 0) {
            throw new common_1.ConflictException('Category cannot be deleted because it is used by transactions');
        }
        await this.prisma.category.delete({
            where: { id: categoryId },
        });
        return { message: 'Category deleted successfully' };
    }
    async findOwnedCategoryOrThrow(userId, categoryId) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category.kind === client_1.CategoryKind.DEFAULT || category.userId !== userId) {
            throw new common_1.ForbiddenException('Only custom categories can be modified');
        }
        return category;
    }
    async ensureNameIsAvailable(userId, name, type, ignoredCategoryId) {
        const existingCategory = await this.prisma.category.findFirst({
            where: {
                name,
                type,
                OR: [{ userId: null }, { userId }],
                id: ignoredCategoryId ? { not: ignoredCategoryId } : undefined,
            },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Category name is already used');
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map