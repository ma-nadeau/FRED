import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTradingTransactionDto } from '@fred/transfer-objects/dtos/transaction/create-trading-transaction.dto';
import { TradingTransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/trading-transaction.dto';
import { UpdateTradingTransactionDto } from '@fred/transfer-objects/dtos/transaction/update-trading-transaction.dto';

@Injectable()
export class TradeTransactionService {
  private prisma = new PrismaClient();

  async createTradeTransaction(
    userId: number,
    createTradeTransactionDto: CreateTradingTransactionDto,
  ): Promise<TradingTransactionResponseDto> {
    const { symbol, transactionAt, quantity, purchasePrice, tradingAccountId } =
      createTradeTransactionDto;

    console.log("createTradeTransactionDto", createTradeTransactionDto);

    // Verify account ownership
    const account = await this.prisma.tradingAccount.findUnique({
      where: { id: tradingAccountId },
    });

    console.log("account", account);

    if (!account) {
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
  ): Promise<TradingTransactionResponseDto> {
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

  /**
   * Deletes a trade transaction by its ID for a user.
   * @param tradeTransactionId - The ID of the trade transaction.
   * @param userId - The ID of the user.
   */
  async deleteTradeTransaction(
    tradeTransactionId: number,
    userId: number,
  ): Promise<void> {
    const tradeTransaction = await this.prisma.tradeStockTransaction.findUnique({
      where: { id: tradeTransactionId },
    });

    if (!tradeTransaction) {
      throw new NotFoundException('Trade transaction not found.');
    }

    const account = await this.prisma.tradingAccount.findUnique({
      where: { id: tradeTransaction.tradingAccountId },
    });

    if (!account || account.id !== userId) {
      throw new ForbiddenException(
        'You do not have access to this trade transaction.',
      );
    }

    await this.prisma.tradeStockTransaction.delete({
      where: { id: tradeTransactionId },
    });
  }

  async updateTradeTransaction(
    tradeTransactionId: number,
    userId: number,
    updateTradeTransactionDto: UpdateTradingTransactionDto,
  ): Promise<TradingTransactionResponseDto> {
    const { id, symbol, transactionAt, quantity, purchasePrice } =
      updateTradeTransactionDto;
    console.log("in service updateTradeTransaction");
    // Verify account ownership

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
      },
    });
    
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const tradeTransaction = await this.prisma.tradeStockTransaction.findUnique({
      where: { id: id },
      include: { tradingAccount: true },
  });

    if (!tradeTransaction) {
      throw new NotFoundException('Trade transaction not found.');
    }
    console.log("accounts", user.accounts);
    const tradingAcc = user.accounts.find(
      (account) => account.tradingAccountId === tradeTransaction.tradingAccountId,
    );
    console.log("tradingAcc", tradingAcc);
    if (!tradingAcc) {
      throw new NotFoundException(
        'Trading account not found or does not belong to the user.',
      );
    }

    if (!tradeTransaction || tradingAcc === undefined || tradingAcc === null) {
      throw new ForbiddenException(
        'You do not have access to this transaction.',
      );
    }

  // Create the trade transaction
  const updatedTradeTransaction = await this.prisma.tradeStockTransaction.update({
    where: { id: tradeTransactionId },
    data: updateTradeTransactionDto
  });

  return this.mapToTradeTransactionResponseDto({
    ...updatedTradeTransaction,
    tradingAccount: { id: tradingAcc.tradingAccountId },
  });
}
}
