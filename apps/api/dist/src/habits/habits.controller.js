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
exports.HabitsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HabitsController = class HabitsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list() {
        return this.prisma.habit.findMany({ orderBy: { createdAt: 'desc' } });
    }
    create(body) {
        return this.prisma.habit.create({
            data: { name: body.name, note: body.note },
        });
    }
    update(id, body) {
        return this.prisma.habit.update({ where: { id }, data: body });
    }
    remove(id) {
        return this.prisma.habit.delete({ where: { id } });
    }
    checkins(habitId) {
        return this.prisma.checkin.findMany({
            where: { habitId },
            orderBy: { date: 'desc' },
        });
    }
    async checkin(habitId, body) {
        const d = new Date(body.date + 'T00:00:00.000Z');
        return this.prisma.checkin.create({ data: { habitId, date: d } });
    }
};
exports.HabitsController = HabitsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/checkins'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HabitsController.prototype, "checkins", null);
__decorate([
    (0, common_1.Post)(':id/checkins'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HabitsController.prototype, "checkin", null);
exports.HabitsController = HabitsController = __decorate([
    (0, common_1.Controller)('habits'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HabitsController);
//# sourceMappingURL=habits.controller.js.map