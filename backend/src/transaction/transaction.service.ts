// src/transaction/transaction.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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
}
