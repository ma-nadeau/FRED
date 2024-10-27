import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AccountType, MainAccount, MainAccountType } from '@prisma/client';

@Injectable()
export class BankAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new bank account for a user.
   * @param userId - The ID of the user.
   * @param data - The data needed to create a bank account.
   * @returns The created main account with the associated bank account.
   */
  async createBankAccount(
    userId: number,
    data: { name: string; type: AccountType; institution: string }
  ): Promise<MainAccount> {
    return this.prisma.mainAccount.create({
      data: {
        user: {
          connect: { id: userId },
        },
        institution: data.institution,
        type: MainAccountType.BANK, // Use the enum provided by Prisma
        bankAccount: {
          create: {
            name: data.name,
            type: data.type,
            balance: 0.0,
            interestRate: 0.0,
          },
        },
      },
      include: {
        bankAccount: true,
      },
    });
  }

  /**
   * Retrieves all bank accounts for a specific user.
   * @param userId - The ID of the user.
   * @returns An array of main accounts with associated bank accounts and transactions.
   */
  async getBankAccountsForUser(userId: number): Promise<MainAccount[]> {
    return this.prisma.mainAccount.findMany({
      where: {
        userId: userId,
        type: MainAccountType.BANK,
      },
      include: {
        bankAccount: {
          include: {
            transactions: true,
          },
        },
      },
    });
  }

  /**
   * Retrieves a specific bank account by its ID.
   * @param accountId - The ID of the main account.
   * @returns The main account with associated bank account and transactions.
   */
  async getBankAccountById(accountId: number): Promise<MainAccount | null> {
    return this.prisma.mainAccount.findUnique({
      where: {
        id: accountId,
      },
      include: {
        bankAccount: {
          include: {
            transactions: true,
          },
        },
      },
    });
  }

  /**
   * Deletes a specific bank account by its ID.
   * @param accountId - The ID of the main account to delete.
   * @returns The deleted main account.
   */
  async deleteBankAccount(accountId: number): Promise<MainAccount> {
    return this.prisma.mainAccount.delete({
      where: {
        id: accountId,
      },
    });
  }
}
