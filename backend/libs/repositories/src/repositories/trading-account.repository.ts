import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Assuming you have a PrismaService
import { TradingAccountType, TradeStockTransaction } from '@prisma/client'; // Generated types
import { TradingAccountDAO } from '@fred/transfer-objects/trading-account.daos'; // Import the DAO 

@Injectable()
export class TradingAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a trading account.
   * @param data - The data required to create a trading account.
   * @returns The created trading account.
   */
  async createTradingAccount(data: {
    name: string;
    balance?: number;
    type: TradingAccountType;
  }): Promise<TradingAccountDAO> {
    const account = await this.prisma.tradingAccount.create({
      data: {
        name: data.name,
        balance: data.balance ?? 0,
        type: data.type,
      },
      include: {
        tradesStock: true, // Include associated trades
      },
    });

    return {
      ...account,
    } as TradingAccountDAO;
  }

  /**
   * Get all trading accounts.
   * @returns An array of trading accounts with associated trades.
   */
  async getAllTradingAccounts(): Promise<TradingAccountDAO[]> {
    const accounts = await this.prisma.tradingAccount.findMany({
      include: {
        tradesStock: true, // Include associated trades
      },
    });

    return accounts as TradingAccountDAO[];
  }

  /**
   * Get a specific trading account by its ID.
   * @param accountId - The ID of the trading account.
   * @returns The trading account with associated trades.
   */
  async getTradingAccountById(accountId: number): Promise<TradingAccountDAO | null> {
    const account = await this.prisma.tradingAccount.findUnique({
      where: { id: accountId },
      include: {
        tradesStock: true, // Include associated trades
      },
    });

    return account as TradingAccountDAO | null;
  }

  /**
   * Update a specific trading account.
   * @param accountId - The ID of the trading account to update.
   * @param data - The data to update the trading account.
   * @returns The updated trading account.
   */
  async updateTradingAccount(
    accountId: number,
    data: Partial<{ name: string; balance: number; type: TradingAccountType }>
  ): Promise<TradingAccountDAO> {
    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.balance !== undefined) {
      updateData.balance = data.balance;
    }
    if (data.type !== undefined) {
      updateData.type = data.type;
    }

    const account = await this.prisma.tradingAccount.update({
      where: {
        id: accountId,
      },
      data: updateData,
      include: {
        tradesStock: true, // Include associated trades
      },
    });

    return account as TradingAccountDAO;
  }

  /**
   * Delete a specific trading account by its ID.
   * @param accountId - The ID of the trading account to delete.
   * @returns The deleted trading account.
   */
  async deleteTradingAccount(accountId: number): Promise<TradingAccountDAO> {
    const account = await this.prisma.tradingAccount.delete({
      where: {
        id: accountId,
      },
      include: {
        tradesStock: true, // Include associated trades
      },
    });

    return account as TradingAccountDAO;
  }

  async getTransactionsForTradingAccount(accountId: number): Promise<TradeStockTransaction[]> {
    const transactions = await this.prisma.tradeStockTransaction.findMany({
      where: { tradingAccountId: accountId },
    });
    return transactions;
  }
}
