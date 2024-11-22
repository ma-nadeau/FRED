import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { CreateTransactionDto } from '@fred/transfer-objects/dtos/transaction/create-transaction.dto';
// import { TransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/transaction-response.dto';
import { BankAccountResponseDto } from '@fred/transfer-objects/dtos/bank-account';
import { CreateTransactionDto, TransactionResponseDto, UpdateTransactionDto } from '@fred/transfer-objects/dtos/transaction.dto';




@Injectable()
export class TransactionService {
  private prisma = new PrismaClient();

  async createTransaction(
    userId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const { description, type, category, transactionAt, amount, accountId } =
      createTransactionDto;

    // Verify account ownership via MainAccount
    const account = await this.prisma.bankAccount.findUnique({
      where: { id: accountId },
      include: {
        account: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Check if any of the MainAccount entries belong to the user
    if (
      !account ||
      !account.account.some(
        (mainAccount: { userId: number }) => mainAccount.userId === userId,
      )
    ) {
      throw new ForbiddenException(
        'You do not have access to this bank account.',
      );
    }

    // Check for duplicate transaction
    const existingTransaction = await this.prisma.transaction.findFirst({
      where: {
        description,
        type,
        category,
        amount,
        accountId,
        transactionAt: {
          equals: new Date(transactionAt).toISOString(), // Normalize date
        },
      },
    });

    console.log('Existing Transaction:', existingTransaction);

    if (existingTransaction) {
      throw new BadRequestException('Transaction is already saved.');
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

  /**
   * Fetch all bank accounts associated with the authenticated user.
   * @param userId - The ID of the user.
   * @returns A list of bank accounts owned by the user.
   */
  // async getBankAccountsForUser(
  //   userId: number,
  // ): Promise<BankAccountResponseDto[]> {
  //   const bankAccounts = await this.prisma.bankAccount.findMany({
  //     where: {
  //       account: {
  //         some: { userId }, // Ensure the user owns the MainAccount associated with the BankAccount
  //       },
  //     },
  //     include: {
  //       transactions: {
  //         select: {
  //           id: true,
  //           accountId: true,
  //           amount: true,
  //           type: true,
  //           transactionAt: true,
  //           description: true,
  //         },
  //       },
  //     },
  //   });

  //   return bankAccounts.map((bankAccount) => ({
  //     id: bankAccount.id,
  //     name: bankAccount.name,
  //     type: bankAccount.type,
  //     balance: bankAccount.balance,
  //     interestRate: bankAccount.interestRate,
  //     transactions: bankAccount.transactions.map((transaction) => ({
  //       id: transaction.id,
  //       accountId: transaction.accountId,
  //       amount: transaction.amount,
  //       type: transaction.type,
  //       transactionAt: transaction.transactionAt.toISOString(), // Convert Date to string
  //       description: transaction.description,
  //     })),
  //   }));
  // }

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
      include: { account: { select: { userId: true } } },
    });

    if (
      !account ||
      !account.account.some((mainAccount) => mainAccount.userId === userId)
    ) {
      throw new ForbiddenException(
        'You do not have access to this transaction.',
      );
    }

    return this.mapToTransactionResponseDto(transaction);
  }

  /**
   * Retrieves a specific transaction by its ID for a user.
   * @param transactionId - The ID of the transaction.
   * @param userId - The ID of the user.
   * @returns The transaction as a response DTO.
   */
  // async getTransactionById(
  //   transactionId: number,
  //   userId: number,
  // ): Promise<TransactionResponseDto> {
  //   const transaction = await this.prisma.transaction.findUnique({
  //     where: { id: transactionId },
  //   });

  //   if (!transaction) {
  //     throw new NotFoundException('Transaction not found.');
  //   }

  //   const account = await this.prisma.bankAccount.findUnique({
  //     where: { id: transaction.accountId },
  //   });

  //   if (!account || account.id !== userId) {
  //     throw new ForbiddenException(
  //       'You do not have access to this transaction.',
  //     );
  //   }

  //   return this.mapToTransactionResponseDto(transaction);
  // }


  /**
   * Updates a transaction by its ID for a user.
   * @param transactionId - The ID of the transaction.
   * @param userId - The ID of the user.
   * @param updateTransactionDto - The updated transaction details.
   * @returns The updated transaction as a response DTO.
   */
  async updateTransaction(
    transactionId: number,
    userId: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { account: true },
    });

    if (!transaction || !transaction.account || transaction.account.id !== userId) {
      throw new ForbiddenException(
        'You do not have access to this transaction.',
      );
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: updateTransactionDto,
    });

    return this.mapToTransactionResponseDto(updatedTransaction);
  }

  /**
   * Deletes a transaction by its ID for a user.
   * @param transactionId - The ID of the transaction.
   * @param userId - The ID of the user.
   */
  async deleteTransaction(
    transactionId: number,
    userId: number,
  ): Promise<void> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { account: true },
    });
    if (
      !transaction ||
      !transaction.account ||
      transaction.account.id !== userId
    ) {
      throw new ForbiddenException(
        'You do not have access to this transaction.',
      );
    }

    await this.prisma.transaction.delete({
      where: { id: transactionId },
    });
  }
}
