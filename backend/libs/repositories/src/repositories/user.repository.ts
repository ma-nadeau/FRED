import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as bcrypt from 'bcrypt'; // For password hashing
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
      user: Omit<UserDAO, 'password'>; // Omit password in the return type
    } | {
      success: false;
    }> {
        // Fetch user including the password (temporarily)
        const user = await this.prisma.user.findFirst({
          where: { email },
          select: { id: true, name: true, email: true, age: true, password: true }, // Include password temporarily
        });
      
        if (!user) {
          return { success: false };
        }
      
        // Compare hashed password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return { success: false };
        }
      
        // Destructure password to exclude it from the response
        const { password: _, ...userWithoutPassword } = user;

        return { success: true, user: userWithoutPassword };
    }
}
