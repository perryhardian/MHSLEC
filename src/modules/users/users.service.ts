import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AutomationsService } from '../automations/automations.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly automationsService: AutomationsService,
  ) {}

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getProfile(userId: string) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toProfileResponse(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        university: dto.university,
        monthlyAllowance: dto.monthlyAllowance,
        expectedDailySpend: dto.expectedDailySpend,
        timeSkipDays: dto.timeSkipDays,
      },
    });

    if (dto.timeSkipDays !== undefined) {
      await Promise.all([
        this.automationsService.materializeDailyExpenses(userId),
        this.automationsService.materializeAutoSavings(userId),
      ]);
    }

    return this.toProfileResponse(user);
  }

  async timeSkip(userId: string, days: number) {
    const currentUser = await this.findById(userId);

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const previousReferenceDate = this.addDays(
      this.startOfUtcDay(new Date()),
      currentUser.timeSkipDays,
    );

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        timeSkipDays: currentUser.timeSkipDays + days,
      },
    });

    const nextReferenceDate = this.addDays(previousReferenceDate, days);
    const firstSkippedDate = this.addDays(previousReferenceDate, 1);

    await Promise.all([
      this.automationsService.materializeDailyExpensesForRange(
        userId,
        firstSkippedDate,
        nextReferenceDate,
      ),
      this.automationsService.materializeAutoSavingsForRange(
        userId,
        firstSkippedDate,
        nextReferenceDate,
      ),
    ]);

    return this.toProfileResponse(user);
  }

  private addDays(date: Date, days: number) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  private startOfUtcDay(date: Date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  private toProfileResponse(user: {
    id: string;
    name: string;
    email: string;
    role: unknown;
    monthlyAllowance: unknown;
    expectedDailySpend: unknown;
    timeSkipDays: number;
    phoneNumber: string | null;
    university: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      monthlyAllowance:
        user.monthlyAllowance === null ? null : Number(user.monthlyAllowance),
      expectedDailySpend:
        user.expectedDailySpend === null ? null : Number(user.expectedDailySpend),
      timeSkipDays: user.timeSkipDays,
      phoneNumber: user.phoneNumber,
      university: user.university,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
