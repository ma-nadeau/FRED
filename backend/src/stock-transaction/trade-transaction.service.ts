import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTradingTransactionDto } from '@fred/transfer-objects/dtos/transaction/create-trading-transaction.dto';
import { TradingTransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/trading-transaction.dto';

@Injectable()
export class TradeTransactionService {
  private prisma = new PrismaClient();

  async createTradeTransaction(
    userId: number,
    createTradeTransactionDto: CreateTradingTransactionDto,
  ): Promise<TradingTransactionResponseDto> {
    const { symbol, transactionAt, quantity, purchasePrice, tradingAccountId } =
      createTradeTransactionDto;

    // Verify account ownership
    const account = await this.prisma.bankAccount.findUnique({
      where: { id: tradingAccountId },
    });

    if (!account || account.id !== userId) {
      throw new NotFoundException(
        'Bank account not found or does not belong to the user.',
      );
    }

    // Create the trade transaction
    const tradeTransaction = await this.prisma.tradeStockTransaction.create({
      data: {
        symbol,
        transactionAt,
        quantity,
        purchasePrice,
        tradingAccount: { connect: { id: tradingAccountId } },
      },
    });

    return this.mapToTradeTransactionResponseDto({
      ...tradeTransaction,
      tradingAccount: { id: tradingAccountId },
    });
  }

  private mapToTradeTransactionResponseDto(
    tradeTransaction: any,
  ): TradingTransactionResponseDto {
    return {
      id: tradeTransaction.id,
      symbol: tradeTransaction.symbol,
      transactionAt: tradeTransaction.transactionAt,
      quantity: tradeTransaction.quantity,
      purchasePrice: tradeTransaction.purchasePrice,
      tradingAccountId: tradeTransaction.tradingAccountId,
      tradingAccount: { id: tradeTransaction.tradingAccountId },
    };
  }

  /**
   * Retrieves a specific trade transaction by its ID for a user.
   * @param tradeTransactionId - The ID of the trade transaction.
   * @param userId - The ID of the user.
   * @returns The trade transaction as a response DTO.
   */
  async getTradeTransactionById(
    tradeTransactionId: number,
    userId: number,
  ): Promise<CreateTradingTransactionDto> {
    const tradeTransaction = await this.prisma.tradeStockTransaction.findUnique(
      {
        where: { id: tradeTransactionId },
      },
    );

    if (!tradeTransaction) {
      throw new NotFoundException('Trade transaction not found.');
    }

    const account = await this.prisma.bankAccount.findUnique({
      where: { id: tradeTransaction.tradingAccountId },
    });

    if (!account || account.id !== userId) {
      throw new ForbiddenException(
        'You do not have access to this trade transaction.',
      );
    }

    return this.mapToTradeTransactionResponseDto(tradeTransaction);
  }
}
