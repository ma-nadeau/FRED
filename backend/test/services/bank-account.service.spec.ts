import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountService } from '../../src/bank/bank-account.service'; // Adjust import path as needed
import { BankAccountRepository } from '../../libs/repositories/src/repositories/bank-account.repository'; // Adjust import path as needed
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateBankAccountDto } from '@hubber/transfer-objects/dtos/bank-account'; // Adjust import path as needed
import { BankAccountDAO } from '@hubber/transfer-objects/bank-account.daos'; // Adjust import path as needed
import { AccountType, MainAccountType } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('BankAccountService', () => {
  let service: BankAccountService;
  let bankAccountRepository: DeepMockProxy<BankAccountRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankAccountService,
        {
          provide: BankAccountRepository,
          useValue: mockDeep<BankAccountRepository>(),
        },
      ],
    }).compile();

    service = module.get<BankAccountService>(BankAccountService);
    bankAccountRepository = module.get(BankAccountRepository) as DeepMockProxy<BankAccountRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBankAccount', () => {
    it('should create a new bank account and return response DTO', async () => {
      const userId = 1;
      const createBankAccountDto: CreateBankAccountDto = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        institution: 'Test Bank',
        balance: 1000,
        interestRate: 1.5,
      };

      const mockBankAccountDAO: BankAccountDAO = {
        id: 1,
        name: createBankAccountDto.name,
        type: createBankAccountDto.type,
        balance: createBankAccountDto.balance,
        interestRate: createBankAccountDto.interestRate,
        transactions: [],
        account: {
          id: 1,
          userId: userId,
          type: MainAccountType.BANK,
          institution: createBankAccountDto.institution,
        },
      };

      bankAccountRepository.createBankAccount.mockResolvedValue(mockBankAccountDAO);

      const result = await service.createBankAccount(userId, createBankAccountDto);

      expect(result).toEqual({
        id: mockBankAccountDAO.id,
        name: mockBankAccountDAO.name,
        type: mockBankAccountDAO.type,
        balance: mockBankAccountDAO.balance,
        interestRate: mockBankAccountDAO.interestRate,
        transactions: [],
      });

      expect(bankAccountRepository.createBankAccount).toHaveBeenCalledWith(userId, {
        name: createBankAccountDto.name,
        type: createBankAccountDto.type,
        institution: createBankAccountDto.institution,
        balance: createBankAccountDto.balance,
        interestRate: createBankAccountDto.interestRate,
      });
    });
  });

  describe('getBankAccountsForUser', () => {
    it('should return an array of bank account response DTOs', async () => {
      const userId = 1;

      const mockBankAccountDAOs: BankAccountDAO[] = [
        {
          id: 1,
          name: 'Account 1',
          type: AccountType.CHECKING,
          balance: 1000,
          interestRate: 1.5,
          transactions: [],
          account: {
            id: 1,
            userId: userId,
            type: MainAccountType.BANK,
            institution: 'Test Bank',
          },
        },
        {
          id: 2,
          name: 'Account 2',
          type: AccountType.SAVINGS_TFSA,
          balance: 2000,
          interestRate: 2.0,
          transactions: [],
          account: {
            id: 2,
            userId: userId,
            type: MainAccountType.BANK,
            institution: 'Test Bank',
          },
        },
      ];

      bankAccountRepository.getBankAccountsForUser.mockResolvedValue(mockBankAccountDAOs);

      const result = await service.getBankAccountsForUser(userId);

      expect(result).toEqual(
        mockBankAccountDAOs.map((account) => ({
          id: account.id,
          name: account.name,
          type: account.type,
          balance: account.balance,
          interestRate: account.interestRate,
          transactions: [],
        })),
      );

      expect(bankAccountRepository.getBankAccountsForUser).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException when no accounts are found', async () => {
      const userId = 1;
      bankAccountRepository.getBankAccountsForUser.mockResolvedValue([]);

      await expect(service.getBankAccountsForUser(userId)).rejects.toThrow(NotFoundException);
      expect(bankAccountRepository.getBankAccountsForUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('getBankAccountById', () => {
    it('should return bank account response DTO when account exists and user has access', async () => {
      const userId = 1;
      const accountId = 1;

      const mockBankAccountDAO: BankAccountDAO = {
        id: accountId,
        name: 'Account 1',
        type: AccountType.CHECKING,
        balance: 1000,
        interestRate: 1.5,
        transactions: [],
        account: {
          id: 1,
          userId: userId,
          type: MainAccountType.BANK,
          institution: 'Test Bank',
        },
      };

      bankAccountRepository.getBankAccountById.mockResolvedValue(mockBankAccountDAO);

      const result = await service.getBankAccountById(accountId, userId);

      expect(result).toEqual({
        id: mockBankAccountDAO.id,
        name: mockBankAccountDAO.name,
        type: mockBankAccountDAO.type,
        balance: mockBankAccountDAO.balance,
        interestRate: mockBankAccountDAO.interestRate,
        transactions: [],
      });

      expect(bankAccountRepository.getBankAccountById).toHaveBeenCalledWith(accountId);
    });

    it('should throw NotFoundException when account does not exist', async () => {
      const userId = 1;
      const accountId = 1;

      bankAccountRepository.getBankAccountById.mockResolvedValue(null);

      await expect(service.getBankAccountById(accountId, userId)).rejects.toThrow(NotFoundException);
      expect(bankAccountRepository.getBankAccountById).toHaveBeenCalledWith(accountId);
    });

    it('should throw ForbiddenException when user does not have access to account', async () => {
      const userId = 1;
      const accountId = 1;

      const mockBankAccountDAO: BankAccountDAO = {
        id: accountId,
        name: 'Account 1',
        type: AccountType.CHECKING,
        balance: 1000,
        interestRate: 1.5,
        transactions: [],
        account: {
          id: 1,
          userId: 2, // Different user ID
          type: MainAccountType.BANK,
          institution: 'Test Bank',
        },
      };

      bankAccountRepository.getBankAccountById.mockResolvedValue(mockBankAccountDAO);

      await expect(service.getBankAccountById(accountId, userId)).rejects.toThrow(ForbiddenException);
      expect(bankAccountRepository.getBankAccountById).toHaveBeenCalledWith(accountId);
    });
  });

  describe('deleteBankAccount', () => {
    it('should delete bank account when account exists and user has access', async () => {
      const userId = 1;
      const accountId = 1;

      const mockBankAccountDAO: BankAccountDAO = {
        id: accountId,
        name: 'Account 1',
        type: AccountType.CHECKING,
        balance: 1000,
        interestRate: 1.5,
        transactions: [],
        account: {
          id: 1,
          userId: userId,
          type: MainAccountType.BANK,
          institution: 'Test Bank',
        },
      };

      bankAccountRepository.getBankAccountById.mockResolvedValue(mockBankAccountDAO);
      bankAccountRepository.deleteBankAccount.mockResolvedValue(mockBankAccountDAO);

      await service.deleteBankAccount(accountId, userId);

      expect(bankAccountRepository.getBankAccountById).toHaveBeenCalledWith(accountId);
      expect(bankAccountRepository.deleteBankAccount).toHaveBeenCalledWith(accountId);
    });

    it('should throw NotFoundException when account does not exist', async () => {
      const userId = 1;
      const accountId = 1;

      bankAccountRepository.getBankAccountById.mockResolvedValue(null);

      await expect(service.deleteBankAccount(accountId, userId)).rejects.toThrow(NotFoundException);
      expect(bankAccountRepository.getBankAccountById).toHaveBeenCalledWith(accountId);
      expect(bankAccountRepository.deleteBankAccount).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user does not have permission to delete account', async () => {
      const userId = 1;
      const accountId = 1;

      const mockBankAccountDAO: BankAccountDAO = {
        id: accountId,
        name: 'Account 1',
        type: AccountType.CHECKING,
        balance: 1000,
        interestRate: 1.5,
        transactions: [],
        account: {
          id: 1,
          userId: 2, // Different user ID
          type: MainAccountType.BANK,
          institution: 'Test Bank',
        },
      };

      bankAccountRepository.getBankAccountById.mockResolvedValue(mockBankAccountDAO);

      await expect(service.deleteBankAccount(accountId, userId)).rejects.toThrow(ForbiddenException);
      expect(bankAccountRepository.getBankAccountById).toHaveBeenCalledWith(accountId);
      expect(bankAccountRepository.deleteBankAccount).not.toHaveBeenCalled();
    });
  });
});
