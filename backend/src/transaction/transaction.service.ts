// src/transaction/transaction.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTransactionDto } from '@fred/transfer-objects/dtos/transaction/create-transaction.dto';
import { TransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/transaction-response.dto';

@Injectable()
export class TransactionService {
  private prisma = new PrismaClient();

  async createTransaction(
    userId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const { description, type, category, transactionAt, amount, accountId } =
      createTransactionDto;

    // Verify account ownership
    const account = await this.prisma.bankAccount.findUnique({
      where: { id: accountId },
    });

    if (!account || account.id !== userId) {
      throw new NotFoundException(
        'Bank account not found or does not belong to the user.',
      );
    }

    // Create the transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        description,
        type,
        category,
        transactionAt,
        amount,
        account: { connect: { id: accountId } },
      },
    });

    return this.mapToTransactionResponseDto(transaction);
  }

  private mapToTransactionResponseDto(
    transaction: any,
  ): TransactionResponseDto {
    return {
      id: transaction.id,
      description: transaction.description,
      type: transaction.type,
      category: transaction.category,
      transactionAt: transaction.transactionAt,
      amount: transaction.amount,
      accountId: transaction.accountId,
    };
  }

  /**
   * Retrieves a specific transaction by its ID for a user.
   * @param transactionId - The ID of the transaction.
   * @param userId - The ID of the user.
   * @returns The transaction as a response DTO.
   */
  async getTransactionById(
    transactionId: number,
    userId: number,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }

    const account = await this.prisma.bankAccount.findUnique({
      where: { id: transaction.accountId },
    });

    if (!account || account.id !== userId) {
      throw new ForbiddenException(
        'You do not have access to this transaction.',
      );
    }

    return this.mapToTransactionResponseDto(transaction);
  }

  /**
   * Deletes a transaction by its ID for a user.
   * @param transactionId - The ID of the transaction.
   * @param userId - The ID of the user.
   */
  async deleteTransaction(transactionId: number, userId: number): Promise<void> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { account: true },
    });

    if (!transaction || !transaction.account || transaction.account.id !== userId) {
      throw new ForbiddenException(
        'You do not have access to this transaction.',
      );
    }

    await this.prisma.transaction.delete({
      where: { id: transactionId },
    });
  }
}
