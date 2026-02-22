import { PrismaService } from '../prisma/prisma.service';
export declare class HabitsController {
    private prisma;
    constructor(prisma: PrismaService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        note: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(body: {
        name: string;
        note?: string;
    }): import("@prisma/client").Prisma.Prisma__HabitClient<{
        id: string;
        name: string;
        note: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: {
        name?: string;
        note?: string;
        isActive?: boolean;
    }): import("@prisma/client").Prisma.Prisma__HabitClient<{
        id: string;
        name: string;
        note: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__HabitClient<{
        id: string;
        name: string;
        note: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    checkins(habitId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        habitId: string;
        date: Date;
    }[]>;
    checkin(habitId: string, body: {
        date: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        habitId: string;
        date: Date;
    }>;
}
