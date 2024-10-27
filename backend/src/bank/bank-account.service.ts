import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BankAccountRepository } from '../../libs/repositories/src/repositories/bank-account.repository'; // Adjust import path as needed
import { CreateBankAccountDto, BankAccountResponseDto, TransactionDto } from '@hubber/transfer-objects/dtos/bank-account';

@Injectable()
export class BankAccountService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  // Create a new bank account for a user
  async createBankAccount(userId: number, createBankAccountDto: CreateBankAccountDto): Promise<BankAccountResponseDto> {
    const { name, type, institution, balance, interestRate } = createBankAccountDto;
    
    // Create the bank account using the repository
    const account = await this.bankAccountRepository.createBankAccount(userId, { name, type, institution, balance, interestRate });
    
    // Map the response to match the expected DTO structure
    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance?? 0, // Ensure balance is defined
      transactions: account.transactions?.map(transaction => ({
        id: transaction.id,
        accountId: transaction.accountId,
        type: transaction.type,
        amount: transaction.amount,
        transactionAt: transaction.transactionAt.toISOString(),
        description: transaction.description,
      })) ?? [], // Ensure transactions are included
      interestRate: account.interestRate  ?? 0, // Ensure interestRate is defined
    };
  }

  async getBankAccountsForUser(userId: number): Promise<BankAccountResponseDto[]> {
    const accounts = await this.bankAccountRepository.getBankAccountsForUser(userId);

    if (!accounts.length) {
      throw new NotFoundException('No bank accounts found for this user.');
    }

    return accounts.map(account => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance ?? 0, // Ensure balance is defined
      transactions: account.transactions?.map(transaction => ({
        id: transaction.id,
        accountId: transaction.accountId,
        type: transaction.type,
        amount: transaction.amount,
        transactionAt: transaction.transactionAt.toISOString(),
        description: transaction.description,
      })) ?? [], // Ensure transactions are included
      interestRate: account.interestRate ?? 0, // Ensure interestRate is defined
    }));
  }

  async getBankAccountById(
    accountId: number,
    userId: number
  ): Promise<BankAccountResponseDto> {
    const account = await this.bankAccountRepository.getBankAccountById(accountId);
  
    if (!account || account.account?.userId !== userId) {
      throw new NotFoundException('Bank account not found or you do not have access to this account.');
    }
  
    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance ?? 0, // Ensure balance is defined
      transactions: account.transactions?.map(transaction => ({
        id: transaction.id,
        accountId: transaction.accountId,
        type: transaction.type,
        amount: transaction.amount,
        transactionAt: transaction.transactionAt.toISOString(),
        description: transaction.description,
      })) ?? [], // Ensure transactions are included
      interestRate: account.interestRate ?? 0, // Ensure interestRate is defined
    };
  }

  async deleteBankAccount(accountId: number, userId: number): Promise<void> {
    const account = await this.bankAccountRepository.getBankAccountById(accountId);
    
    if (!account || account.account?.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this account.');
    }

    await this.bankAccountRepository.deleteBankAccount(accountId);
  }
}