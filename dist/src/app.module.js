"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const auth_module_1 = require("./modules/auth/auth.module");
const budgets_module_1 = require("./modules/budgets/budgets.module");
const categories_module_1 = require("./modules/categories/categories.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const reports_module_1 = require("./modules/reports/reports.module");
const savings_goals_module_1 = require("./modules/savings-goals/savings-goals.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const users_module_1 = require("./modules/users/users.module");
const prisma_module_1 = require("./prisma/prisma.module");
const env_validation_1 = require("./config/env.validation");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, validate: env_validation_1.validateEnv }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 120,
                },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            categories_module_1.CategoriesModule,
            transactions_module_1.TransactionsModule,
            budgets_module_1.BudgetsModule,
            savings_goals_module_1.SavingsGoalsModule,
            notifications_module_1.NotificationsModule,
            analytics_module_1.AnalyticsModule,
            reports_module_1.ReportsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map