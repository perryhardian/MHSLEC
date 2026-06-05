import { PrismaService } from '../../prisma/prisma.service';
import { AutomationsService } from '../automations/automations.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private readonly prisma;
    private readonly automationsService;
    constructor(prisma: PrismaService, automationsService: AutomationsService);
    findById(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.UserRole;
        monthlyAllowance: import("@prisma/client-runtime-utils").Decimal | null;
        phoneNumber: string | null;
        university: string | null;
        createdAt: Date;
        updatedAt: Date;
        expectedDailySpend: import("@prisma/client-runtime-utils").Decimal | null;
        timeSkipDays: number;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findByEmail(email: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string;
        email: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.UserRole;
        monthlyAllowance: import("@prisma/client-runtime-utils").Decimal | null;
        phoneNumber: string | null;
        university: string | null;
        createdAt: Date;
        updatedAt: Date;
        expectedDailySpend: import("@prisma/client-runtime-utils").Decimal | null;
        timeSkipDays: number;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: unknown;
        monthlyAllowance: number | null;
        expectedDailySpend: number | null;
        timeSkipDays: number;
        phoneNumber: string | null;
        university: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: unknown;
        monthlyAllowance: number | null;
        expectedDailySpend: number | null;
        timeSkipDays: number;
        phoneNumber: string | null;
        university: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    timeSkip(userId: string, days: number): Promise<{
        id: string;
        name: string;
        email: string;
        role: unknown;
        monthlyAllowance: number | null;
        expectedDailySpend: number | null;
        timeSkipDays: number;
        phoneNumber: string | null;
        university: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private addDays;
    private startOfUtcDay;
    private toProfileResponse;
}
