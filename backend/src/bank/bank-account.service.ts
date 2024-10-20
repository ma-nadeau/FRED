import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BankAccountRepository } from '../../libs/repositories/src/repositories/bank-account.repository'; // Adjust import path as needed
import { CreateBankAccountDto, BankAccountResponseDto, TransactionDto } from '@hubber/transfer-objects/dtos/bank-account';

@Injectable()
export class BankAccountService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  // Create a new bank account for a user
  async createBankAccount(userId: number, createBankAccountDto: CreateBankAccountDto): Promise<BankAccountResponseDto> {
    const { name, type, institution } = createBankAccountDto;
    
    const account = await this.bankAccountRepository.createBankAccount(userId, { name, type, institution });
    
    // Map the response to match the expected DTO structure
    return {
      id: account.bankAccount.id,
      name: account.bankAccount.name,
      type: account.bankAccount.type,
      balance: account.bankAccount.balance,
      transactions: [], // Initially, the account will have no transactions
      interestRate: account.bankAccount.interestRate,
    };
  }

  // Get all bank accounts for a specific user
  async getBankAccountsForUser(userId: number): Promise<BankAccountResponseDto[]> {
    const accounts = await this.bankAccountRepository.getBankAccountsForUser(userId);

    if (!accounts.length) {
      throw new NotFoundException('No bank accounts found for this user.');
    }

    // Map each account to the expected DTO structure
    return accounts.map(account => ({
      id: account.bankAccount.id,
      name: account.bankAccount.name,
      type: account.bankAccount.type,
      balance: account.bankAccount.balance,
      transactions: account.bankAccount.transactions.map(transaction => ({
        id: transaction.id,
        accountId: transaction.accountId, // Include the accountId field in the transaction mapping
        type: transaction.type,
        amount: transaction.amount,
        transactionAt: transaction.transactionAt.toISOString(), // Convert Date to string
        description: transaction.description,
      })),
      interestRate: account.bankAccount.interestRate,
    }));
  }

  // Get a specific bank account by its ID
  async getBankAccountById(accountId: number, userId: number): Promise<BankAccountResponseDto> {
    const account = await this.bankAccountRepository.getBankAccountById(accountId);
    
    if (!account || account.userId !== userId) {
      throw new NotFoundException('Bank account not found or you do not have access to this account.');
    }

    // Map the account to the expected DTO structure
    return {
      id: account.bankAccount.id,
      name: account.bankAccount.name,
      type: account.bankAccount.type,
      balance: account.bankAccount.balance,
      transactions: account.bankAccount.transactions.map(transaction => ({
        id: transaction.id,
        accountId: transaction.accountId, // Include the accountId field in the transaction mapping
        type: transaction.type,
        amount: transaction.amount,
        transactionAt: transaction.transactionAt.toISOString(),
        description: transaction.description,
      })),
      interestRate: account.bankAccount.interestRate,
    };
  }

  // Delete a specific bank account
  async deleteBankAccount(accountId: number, userId: number): Promise<void> {
    const account = await this.bankAccountRepository.getBankAccountById(accountId);
    
    if (!account || account.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this account.');
    }

    await this.bankAccountRepository.deleteBankAccount(accountId);
  }
}
