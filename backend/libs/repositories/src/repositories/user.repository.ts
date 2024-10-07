import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UserDAO } from "@hubber/transfer-objects/daos";

@Injectable()
export class UserRepository {

    constructor(private readonly prisma: PrismaService) {}

    async findById(
        userId: number,
    ): Promise<UserDAO> {
        return this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, age: true } });
    }

    async create(
        name: string,
        email: string,
        age: number,
        password: string,
    ): Promise<UserDAO> {
        return this.prisma.user.create({
            data: {
                name,
                email,
                age,
                password,
            },
        });
    }

    async updateName(
        id: number,
        name: string,
    ): Promise<UserDAO> {
        return this.prisma.user.update({
            where: { id },
            data: { name },
        });
    }

    async updatePassword(
        id: number,
        password: string,
    ): Promise<UserDAO> {
        return this.prisma.user.update({
            where: { id },
            data: { password },
        });
    }

    async isEmailTaken(
        email: string,
    ): Promise<boolean> {
        return Boolean(await this.prisma.user.findUnique({ where: { email } }));
    }

    async verifyPassword(
        email: string,
        password: string,
    ): Promise<{
        success: true;
        user: UserDAO;
    } | {
        success: false;
    }> {
        const user = await this.prisma.user.findFirst({ where: { email } });
        if (!user) {
            return { success: false };
        }
        if (user.password !== password) {
            return { success: false };
        }
        return { success: true, user };
    }

}
