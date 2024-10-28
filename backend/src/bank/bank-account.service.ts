import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { BankAccountRepository } from '../../libs/repositories/src/repositories/bank-account.repository'; // Adjust import path as needed
import {
  CreateBankAccountDto,
  BankAccountResponseDto,
  TransactionDto,
} from '@fred/transfer-objects/dtos/bank-account';
import { BankAccountDAO } from '@fred/transfer-objects/bank-account.daos';

@Injectable()
export class BankAccountService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  /**
   * Creates a new bank account for a user.
   * @param userId - The ID of the user.
   * @param createBankAccountDto - The DTO containing bank account details.
   * @returns The created bank account as a response DTO.
   */
  async createBankAccount(
    userId: number,
    createBankAccountDto: CreateBankAccountDto,
  ): Promise<BankAccountResponseDto> {
    const { name, type, institution, balance, interestRate } =
      createBankAccountDto;

    // Create the bank account using the repository
    const account = await this.bankAccountRepository.createBankAccount(userId, {
      name,
      type,
      institution,
      balance,
      interestRate,
    });

    // Map the response to match the expected DTO structure
    return this.mapToBankAccountResponseDto(account);
  }

  /**
   * Retrieves all bank accounts for a user.
   * @param userId - The ID of the user.
   * @returns An array of bank account response DTOs.
   */
  async getBankAccountsForUser(
    userId: number,
  ): Promise<BankAccountResponseDto[]> {
    const accounts = await this.bankAccountRepository.getBankAccountsForUser(
      userId,
    );

    if (!accounts.length) {
      throw new NotFoundException('No bank accounts found for this user.');
    }

    return accounts.map((account) => this.mapToBankAccountResponseDto(account));
  }

  /**
   * Retrieves a specific bank account by its ID for a user.
   * @param accountId - The ID of the bank account.
   * @param userId - The ID of the user.
   * @returns The bank account as a response DTO.
   */
  async getBankAccountById(
    accountId: number,
    userId: number,
  ): Promise<BankAccountResponseDto> {
    const account = await this.bankAccountRepository.getBankAccountById(
      accountId,
    );

    if (!account) {
      throw new NotFoundException('Bank account not found.');
    }

    if (account.account?.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this bank account.',
      );
    }

    return this.mapToBankAccountResponseDto(account);
  }

  /**
   * Deletes a bank account by its ID for a user.
   * @param accountId - The ID of the bank account.
   * @param userId - The ID of the user.
   */
  async deleteBankAccount(accountId: number, userId: number): Promise<void> {
    const account = await this.bankAccountRepository.getBankAccountById(
      accountId,
    );

    if (!account) {
      throw new NotFoundException('Bank account not found.');
    }

    if (account.account?.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this account.',
      );
    }

    await this.bankAccountRepository.deleteBankAccount(accountId);
  }

  /**
   * Maps a BankAccountDAO to a BankAccountResponseDto.
   * @param account - The BankAccountDAO object.
   * @returns The BankAccountResponseDto object.
   */
  private mapToBankAccountResponseDto(
    account: BankAccountDAO,
  ): BankAccountResponseDto {
    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance ?? 0,
      interestRate: account.interestRate ?? 0,
      transactions:
        account.transactions?.map((transaction: { id: any; accountId: any; type: any; amount: any; transactionAt: { toISOString: () => any; }; description: any; }) => ({
          id: transaction.id,
          accountId: transaction.accountId,
          type: transaction.type,
          amount: transaction.amount,
          transactionAt: transaction.transactionAt.toISOString(),
          description: transaction.description,
        })) ?? [],
    };
  }
}
