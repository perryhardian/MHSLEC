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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingsGoalsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const upsert_auto_savings_setting_dto_1 = require("../automations/dto/upsert-auto-savings-setting.dto");
const add_savings_contribution_dto_1 = require("./dto/add-savings-contribution.dto");
const create_savings_goal_dto_1 = require("./dto/create-savings-goal.dto");
const list_savings_goals_query_dto_1 = require("./dto/list-savings-goals-query.dto");
const update_savings_goal_dto_1 = require("./dto/update-savings-goal.dto");
const savings_goals_service_1 = require("./savings-goals.service");
let SavingsGoalsController = class SavingsGoalsController {
    savingsGoalsService;
    constructor(savingsGoalsService) {
        this.savingsGoalsService = savingsGoalsService;
    }
    findAll(user, query) {
        return this.savingsGoalsService.findAll(user.id, query);
    }
    findOne(user, id) {
        return this.savingsGoalsService.findOne(user.id, id);
    }
    create(user, dto) {
        return this.savingsGoalsService.create(user.id, dto);
    }
    update(user, id, dto) {
        return this.savingsGoalsService.update(user.id, id, dto);
    }
    delete(user, id) {
        return this.savingsGoalsService.delete(user.id, id);
    }
    findContributions(user, id) {
        return this.savingsGoalsService.findContributions(user.id, id);
    }
    getAutoSavingsSetting(user, id) {
        return this.savingsGoalsService.getAutoSavingsSetting(user.id, id);
    }
    upsertAutoSavingsSetting(user, id, dto) {
        return this.savingsGoalsService.upsertAutoSavingsSetting(user.id, id, dto);
    }
    addContribution(user, id, dto) {
        return this.savingsGoalsService.addContribution(user.id, id, dto);
    }
};
exports.SavingsGoalsController = SavingsGoalsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_savings_goals_query_dto_1.ListSavingsGoalsQueryDto]),
    __metadata("design:returntype", void 0)
], SavingsGoalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SavingsGoalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_savings_goal_dto_1.CreateSavingsGoalDto]),
    __metadata("design:returntype", void 0)
], SavingsGoalsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_savings_goal_dto_1.UpdateSavingsGoalDto]),
    __metadata("design:returntype", void 0)
], SavingsGoalsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SavingsGoalsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(':id/contributions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SavingsGoalsController.prototype, "findContributions", null);
__decorate([
    (0, common_1.Get)(':id/auto-contribution'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SavingsGoalsController.prototype, "getAutoSavingsSetting", null);
__decorate([
    (0, common_1.Patch)(':id/auto-contribution'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, upsert_auto_savings_setting_dto_1.UpsertAutoSavingsSettingDto]),
    __metadata("design:returntype", void 0)
], SavingsGoalsController.prototype, "upsertAutoSavingsSetting", null);
__decorate([
    (0, common_1.Post)(':id/contributions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_savings_contribution_dto_1.AddSavingsContributionDto]),
    __metadata("design:returntype", void 0)
], SavingsGoalsController.prototype, "addContribution", null);
exports.SavingsGoalsController = SavingsGoalsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('savings-goals'),
    __metadata("design:paramtypes", [savings_goals_service_1.SavingsGoalsService])
], SavingsGoalsController);
//# sourceMappingURL=savings-goals.controller.js.map