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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const automations_service_1 = require("../automations/automations.service");
let TransactionsService = class TransactionsService {
    prisma;
    automationsService;
    constructor(prisma, automationsService) {
        this.prisma = prisma;
        this.automationsService = automationsService;
    }
    async findAll(userId, query) {
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
    async findOne(userId, transactionId) {
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
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async create(userId, dto) {
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
    async update(userId, transactionId, dto) {
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
    async delete(userId, transactionId) {
        await this.findOne(userId, transactionId);
        await this.prisma.transaction.delete({
            where: {
                id: transactionId,
            },
        });
        return { message: 'Transaction deleted successfully' };
    }
    getDailyExpenseSetting(userId) {
        return this.automationsService.getDailyExpenseSetting(userId);
    }
    upsertDailyExpenseSetting(userId, dto) {
        return this.automationsService.upsertDailyExpenseSetting(userId, dto);
    }
    async ensureCategoryCanBeUsed(userId, categoryId, transactionType) {
        const category = await this.prisma.category.findFirst({
            where: {
                id: categoryId,
                OR: [{ userId: null }, { userId }],
            },
        });
        if (!category) {
            throw new common_1.ForbiddenException('Category cannot be used');
        }
        if (category.type !== transactionType) {
            throw new common_1.BadRequestException('Category type must match transaction type');
        }
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        automations_service_1.AutomationsService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map