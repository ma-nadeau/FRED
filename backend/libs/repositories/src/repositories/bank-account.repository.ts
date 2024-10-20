import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Assuming you have a PrismaService
import { AccountType } from '@prisma/client'; // Generated types

@Injectable()
export class BankAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new bank account
  async createBankAccount(userId: number, data: { name: string; type: AccountType; institution: string }) {
    return this.prisma.mainAccount.create({
      data: {
        user: {
          connect: { id: userId }, // Connect the MainAccount to the existing User
        },
        institution: data.institution, // Set the institution name
        type: 'BANK', // Set the type to BANK, as this is for a bank account
        bankAccount: {
          create: {
            name: data.name,
            type: data.type, // Type should match one of the AccountType enums
            balance: 0.0, // Initialize balance to 0
            interestRate: 0.0, // Default interest rate
          },
        },
      },
      include: {
        bankAccount: true, // Include the BankAccount in the response
      },
    });
  }

  // Get all bank accounts for a user
  async getBankAccountsForUser(userId: number) {
    return this.prisma.mainAccount.findMany({
      where: {
        userId: userId, // Access MainAccount using userId
        type: 'BANK', // Ensure we are getting bank accounts (not trading accounts)
      },
      include: {
        bankAccount: {
          include: {
            transactions: true, // Include transactions in the result
          },
        },
      },
    });
  }

  // Get a specific bank account by its ID
  async getBankAccountById(accountId: number) {
    return this.prisma.mainAccount.findUnique({
      where: {
        id: accountId, // Assuming accountId is the MainAccount ID
      },
      include: {
        bankAccount: {
          include: {
            transactions: true, // Include transactions in the result
          },
        },
      },
    });
  }

  // Delete a bank account
  async deleteBankAccount(accountId: number) {
    return this.prisma.mainAccount.delete({
      where: {
        id: accountId, // Assuming accountId is the MainAccount ID
      },
    });
  }
}
