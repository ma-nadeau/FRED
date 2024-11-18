import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Assuming you have a PrismaService
import { AccountType, MainAccountType, Transaction } from '@prisma/client'; // Generated types
import { BankAccountDAO } from '@fred/transfer-objects/bank-account.daos'; // Import the DAO

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
        transactions: {
          include:{
            recurringCashFlow: true,
          }
        },
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
   * Updates a specific bank account with the provided data.
   * @param accountId - The ID of the bank account to update.
   * @param data - An object containing the updated bank account details.
   * @param data.type - The type of the bank account (e.g., Savings, Checking).
   * @param data.name - The name of the bank account.
   * @param data.balance - The balance of the bank account.
   * @param data.interestRate - The interest rate of the bank account.
   * @param data.transactions - An array of transactions to be created for the bank account.
   * @returns The updated bank account.
   */
  async updateBankAccount(accountId: number, data: Partial<{ type: AccountType; name: string; balance: number; interestRate: number; transactions: any[] }>) {
    const updateData: any = {};
  
    if (data.type !== undefined) {
      updateData.type = data.type;
    }
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.balance !== undefined) {
      updateData.balance = data.balance;
    }
    if (data.interestRate !== undefined) {
      updateData.interestRate = data.interestRate;
    }
    if (data.transactions !== undefined) {
      updateData.transactions = {
        createMany: {
          data: data.transactions,
        },
      };
    }
  
    return this.prisma.mainAccount.update({
      where: {
        id: accountId,
      },
      data: {
        bankAccount: {
          update: updateData,
        },
      },
      include: {
        bankAccount: true,
      },
    });
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