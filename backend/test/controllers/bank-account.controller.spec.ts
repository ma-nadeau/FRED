import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountController } from '../../src/bank/bank-account.controller'; // Adjust the import path as needed
import { BankAccountService } from '../../src/bank/bank-account.service'; // Adjust the import path as needed
import {
  CreateBankAccountDto,
  BankAccountResponseDto,
  UpdateBankAccountDto,
} from '@fred/transfer-objects/dtos/bank-account'; // Adjust the import paths as needed
import { User } from '@prisma/client'; // Assuming User type from Prisma
import { SessionGuard } from '../../src/session/session.guard'; // Adjust the import path as needed
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('BankAccountController', () => {
  let controller: BankAccountController;
  let service: DeepMockProxy<BankAccountService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankAccountController],
      providers: [
        {
          provide: BankAccountService,
          useValue: mockDeep<BankAccountService>(),
        },
      ],
    })
      .overrideGuard(SessionGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<BankAccountController>(BankAccountController);
    service = module.get(BankAccountService) as DeepMockProxy<BankAccountService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBankAccount', () => {
    it('should create a bank account and return the response', async () => {
      const user: User = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          age: 30,
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date()
      };

      const createBankAccountDto: CreateBankAccountDto = {
        name: 'Test Account',
        type: 'CHECKING',
        institution: 'Test Bank',
        balance: 1000,
        interestRate: 1.5,
      };

      const mockResponse: BankAccountResponseDto = {
        id: 1,
        name: 'Test Account',
        type: 'CHECKING',
        balance: 1000,
        interestRate: 1.5,
        transactions: [],
      };

      service.createBankAccount.mockResolvedValue(mockResponse);

      const result = await controller.createBankAccount(user, createBankAccountDto);

      expect(result).toEqual(mockResponse);
      expect(service.createBankAccount).toHaveBeenCalledWith(user.id, createBankAccountDto);
    });
  });

  describe('getBankAccountsForUser', () => {
    it('should return an array of bank accounts', async () => {
      const user: User = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          age: 30,
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date()
      };

      const mockResponse: BankAccountResponseDto[] = [
        {
          id: 1,
          name: 'Account 1',
          type: 'CHECKING',
          balance: 1000,
          interestRate: 1.0,
          transactions: [],
        },
        {
          id: 2,
          name: 'Account 2',
          type: 'SAVINGS_TFSA',
          balance: 2000,
          interestRate: 1.5,
          transactions: [],
        },
      ];

      service.getBankAccountsForUser.mockResolvedValue(mockResponse);

      const result = await controller.getBankAccountsForUser(user);

      expect(result).toEqual(mockResponse);
      expect(service.getBankAccountsForUser).toHaveBeenCalledWith(user.id);
    });
  });

  describe('getBankAccountById', () => {
    it('should return a bank account when it exists and belongs to the user', async () => {
      const user: User = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          age: 30,
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date()
      };

      const accountId = 1;

      const mockResponse: BankAccountResponseDto = {
        id: accountId,
        name: 'Account 1',
        type: 'CHECKING',
        balance: 1000,
        interestRate: 1.0,
        transactions: [],
      };

      service.getBankAccountById.mockResolvedValue(mockResponse);

      const result = await controller.getBankAccountById(accountId, user);

      expect(result).toEqual(mockResponse);
      expect(service.getBankAccountById).toHaveBeenCalledWith(accountId, user.id);
    });

    it('should throw NotFoundException when the bank account does not exist', async () => {
      const user: User = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          age: 30,
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date()
      };

      const accountId = 999;

      service.getBankAccountById.mockRejectedValue(new NotFoundException('Bank account not found.'));

      await expect(controller.getBankAccountById(accountId, user)).rejects.toThrow(NotFoundException);
      expect(service.getBankAccountById).toHaveBeenCalledWith(accountId, user.id);
    });

    it('should throw ForbiddenException when the user does not have access to the account', async () => {
      const user: User = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          age: 30,
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date()
      };

      const accountId = 2;

      service.getBankAccountById.mockRejectedValue(
        new ForbiddenException('You do not have access to this bank account.'),
      );

      await expect(controller.getBankAccountById(accountId, user)).rejects.toThrow(ForbiddenException);
      expect(service.getBankAccountById).toHaveBeenCalledWith(accountId, user.id);
    });
  });

  describe('deleteBankAccount', () => {
    it('should delete a bank account when it exists and belongs to the user', async () => {
      const user: User = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          age: 30,
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date()
      };

      const accountId = 1;

      service.deleteBankAccount.mockResolvedValue(undefined);

      const result = await controller.deleteBankAccount(accountId, user);

      expect(result).toBeUndefined();
      expect(service.deleteBankAccount).toHaveBeenCalledWith(accountId, user.id);
    });

    it('should throw NotFoundException when the bank account does not exist', async () => {
      const user: User = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          age: 30,
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date()
      };

      const accountId = 999;

      service.deleteBankAccount.mockRejectedValue(new NotFoundException('Bank account not found.'));

      await expect(controller.deleteBankAccount(accountId, user)).rejects.toThrow(NotFoundException);
      expect(service.deleteBankAccount).toHaveBeenCalledWith(accountId, user.id);
    });

    it('should throw ForbiddenException when the user does not have permission to delete the account', async () => {
      const user: User = {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          age: 30,
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date()
      };

      const accountId = 2;

      service.deleteBankAccount.mockRejectedValue(
        new ForbiddenException('You do not have permission to delete this account.'),
      );

      await expect(controller.deleteBankAccount(accountId, user)).rejects.toThrow(ForbiddenException);
      expect(service.deleteBankAccount).toHaveBeenCalledWith(accountId, user.id);
    });
  });

  describe('updateBankAccount', () => {
    it('should update a bank account successfully', async () => {
      const user: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        age: 30,
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const accountId = 1;

      const updateBankAccountDto: UpdateBankAccountDto = {
        name: 'Updated Account',
        type: 'SAVINGS_TFSA',
        balance: 2000,
        interestRate: 2.0,
        transactions: [],
      };

      const mockResponse: BankAccountResponseDto = {
        id: accountId,
        name: 'Updated Account',
        type: 'SAVINGS_TFSA',
        balance: 2000,
        interestRate: 2.0,
        transactions: [],
      };

      service.updateBankAccount.mockResolvedValue(mockResponse);

      const result = await controller.updateBankAccount(accountId, updateBankAccountDto, user);

      expect(result).toEqual(mockResponse);
      expect(service.updateBankAccount).toHaveBeenCalledWith(user.id, accountId, updateBankAccountDto);
    });

    it('should throw NotFoundException if the bank account does not exist', async () => {
      const user: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        age: 30,
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const accountId = 1;

      const updateBankAccountDto: UpdateBankAccountDto = {
        name: 'Updated Account',
        type: 'SAVINGS_TFSA',
        balance: 2000,
        interestRate: 2.0,
        transactions: [],
      };

      service.updateBankAccount.mockRejectedValue(new NotFoundException('Bank account not found'));

      await expect(controller.updateBankAccount(accountId, updateBankAccountDto, user)).rejects.toThrow(NotFoundException);
    });
  });
});
