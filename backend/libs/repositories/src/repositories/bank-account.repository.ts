import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Assuming you have a PrismaService
import { AccountType, MainAccountType, Transaction } from '@prisma/client'; // Generated types
import { BankAccountDAO } from '@hubber/transfer-objects/bank-account.daos'; // Import the DAO

@Injectable()
export class BankAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a bank account with a main account.
   * @param userId - The ID of the user.
   * @returns a bank account with its main account.
   */
  async createBankAccount(userId: number, data: { name: string; type: AccountType; institution: string; balance?: number; interestRate?: number }): Promise<BankAccountDAO> {
    const account = await this.prisma.bankAccount.create({
      data: {
        name: data.name,
        type: data.type,
        balance: data.balance,
        interestRate: data.interestRate,
        account: {
          create: {
            user: {
              connect: { id: userId },
            },
            institution: data.institution,
            type: MainAccountType.BANK,
          },
        },
      },
      include: {
        account: true,
        transactions: true, // Include transactions in the response
      },
    });

    return {
      ...account,
      account: account.account[0], // Map the account property to a single object
    } as BankAccountDAO;
  }

  /**
   * @returns An array of bank accounts with associated transactions.
   */
  async getBankAccountsForUser(userId: number): Promise<BankAccountDAO[]> {
    const accounts = await this.prisma.bankAccount.findMany({
      where: {
        account: {
          some: {
            userId: userId,
            type: MainAccountType.BANK,
          },
        },
      },
      include: {
        transactions: true,
        account: true,
      },
    });

    return accounts.map((account) => ({
      ...account,
      account: account.account[0],
    })) as BankAccountDAO[];
  }

  /**
   * Retrieves a specific bank account by its ID.
   * @param accountId - The ID of the bank account.
   * @returns The bank account with associated transactions.
   */
  async getBankAccountById(accountId: number): Promise<BankAccountDAO | null> {
    const account = await this.prisma.bankAccount.findUnique({
      where: { id: accountId },
      include: {
        transactions: true,
        account: true,
      },
    });

    if (!account) {
      return null;
    }

    return {
      ...account,
      account: account.account[0],
    } as BankAccountDAO;
  }

  /**
   * Deletes a specific bank account by its ID.
   * @param accountId - The ID of the bank account to delete.
   * @returns The deleted bank account.
   */
  async deleteBankAccount(accountId: number): Promise<BankAccountDAO> {
    const account = await this.prisma.bankAccount.delete({
      where: {
        id: accountId,
      },
      include: {
        transactions: true, // Include transactions in the response
        account: true,
      },
    });

    return {
      ...account,
      account: account.account[0], // Map the account property to a single object
    } as BankAccountDAO;
  }
}