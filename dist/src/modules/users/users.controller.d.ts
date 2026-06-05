import type { AuthUser } from '../auth/types/auth-user.type';
import { TimeSkipDto } from './dto/time-skip.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: AuthUser): Promise<{
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
    updateProfile(user: AuthUser, dto: UpdateProfileDto): Promise<{
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
    timeSkip(user: AuthUser, dto: TimeSkipDto): Promise<{
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
}
