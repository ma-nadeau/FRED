import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TradingAccountRepository } from '../../libs/repositories/src/repositories/trading-account.repository'; // Adjust import path as needed
import {
  CreateTradingAccountDto,
  TradingAccountResponseDto,
  UpdateTradingAccountDto,
} from '@fred/transfer-objects/dtos/trading-account';
import { TradingAccountDAO } from '@fred/transfer-objects/trading-account.daos';
import { TradeStockTransaction } from '@prisma/client';

@Injectable()
export class TradingAccountService {
  constructor(
    private readonly tradingAccountRepository: TradingAccountRepository,
  ) {}

  /**
   * Creates a new trading account.
   * @param createTradingAccountDto - The DTO containing trading account details.
   * @returns The created trading account as a response DTO.
   */
  async addTradingAccount(
    createTradingAccountDto: CreateTradingAccountDto,
  ): Promise<TradingAccountResponseDto> {
    const { name, balance, type } = createTradingAccountDto;

    const account = await this.tradingAccountRepository.createTradingAccount({
      name,
      balance,
      type,
    });

    return this.mapToTradingAccountResponseDto(account);
  }

  /**
   * Retrieves all trading accounts.
   * @returns An array of trading account response DTOs.
   */
  async getAllTradingAccounts(): Promise<TradingAccountResponseDto[]> {
    const accounts =
      await this.tradingAccountRepository.getAllTradingAccounts();

    if (!accounts.length) {
      throw new NotFoundException('No trading accounts found.');
    }

    return accounts.map((account) =>
      this.mapToTradingAccountResponseDto(account),
    );
  }

  /**
   * Retrieves a specific trading account by its ID.
   * @param accountId - The ID of the trading account.
   * @returns The trading account as a response DTO.
   */
  async getTradingAccountById(
    accountId: number,
  ): Promise<TradingAccountResponseDto> {
    const account =
      await this.tradingAccountRepository.getTradingAccountById(accountId);

    if (!account) {
      throw new NotFoundException('Trading account not found.');
    }

    return this.mapToTradingAccountResponseDto(account);
  }

  /**
   * Updates a specific trading account by its ID.
   * @param accountId - The ID of the trading account.
   * @param updateTradingAccountDto - The DTO containing updated trading account details.
   * @returns The updated trading account as a response DTO.
   */
  async updateTradingAccount(
    accountId: number,
    updateTradingAccountDto: UpdateTradingAccountDto,
  ): Promise<TradingAccountResponseDto> {
    // Check if the account exists
    const existingAccount =
      await this.tradingAccountRepository.getTradingAccountById(accountId);
    if (!existingAccount) {
      throw new NotFoundException('Trading account not found.');
    }

    // Update the trading account with the provided data
    const updatedAccount =
      await this.tradingAccountRepository.updateTradingAccount(
        accountId,
        updateTradingAccountDto,
      );

    return this.mapToTradingAccountResponseDto(updatedAccount);
  }

  /**
   * Deletes a trading account by its ID.
   * @param accountId - The ID of the trading account.
   */
  async deleteTradingAccount(accountId: number): Promise<void> {
    const account =
      await this.tradingAccountRepository.getTradingAccountById(accountId);

    if (!account) {
      throw new NotFoundException('Trading account not found.');
    }

    await this.tradingAccountRepository.deleteTradingAccount(accountId);
  }

  /**
   * Maps a TradingAccountDAO to a TradingAccountResponseDto.
   * @param account - The TradingAccountDAO object.
   * @returns The TradingAccountResponseDto object.
   */
  private mapToTradingAccountResponseDto(
    account: TradingAccountDAO,
  ): TradingAccountResponseDto {
    return {
      id: account.id,
      name: account.name,
      balance: account.balance ?? 0,
      type: account.type,
      tradesStock:
        account.tradesStock?.map((trade) => ({
          id: trade.id,
          tradingAccountId: trade.tradingAccountId, // Add this line
          symbol: trade.symbol,
          purchasePrice: trade.purchasePrice,
          sellPrice: trade.sellPrice,
          quantity: trade.quantity,
          transactionAt: trade.transactionAt.toISOString(),
        })) ?? [],
    };
  }

  async getTransactionsForTradingAccount(accountId: number): Promise<TradeStockTransaction[]> {
    const transactions = await this.tradingAccountRepository.getTransactionsForTradingAccount(accountId);
    return transactions;
  }
}
