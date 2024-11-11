import { BankAccountRepository } from '../../libs/repositories/src/repositories/bank-account.repository';
import { PrismaService } from '../../libs/repositories/src/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountType, MainAccountType, Prisma } from '@prisma/client';
import { BankAccountDAO } from '@fred/transfer-objects/bank-account.daos';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';

describe('BankAccountRepository', () => {
  let repository: BankAccountRepository;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankAccountRepository,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    repository = module.get<BankAccountRepository>(BankAccountRepository);
    prismaService = module.get(PrismaService) as DeepMockProxy<PrismaService>;
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createBankAccount', () => {
    it('should create a bank account with main account', async () => {
      const userId = 1;
      const data = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        institution: 'Test Bank',
        balance: 1000,
        interestRate: 0.5,
      };

      const mockBankAccount = {
        id: 1,
        name: data.name,
        type: data.type,
        balance: data.balance,
        interestRate: data.interestRate,
        transactions: [],
        account: [
          {
            id: 1,
            userId: userId,
            type: MainAccountType.BANK,
            institution: data.institution,
          },
        ],
      };

      prismaService.bankAccount.create.mockResolvedValue(mockBankAccount as any);

      const result = await repository.createBankAccount(userId, data);

      expect(result).toEqual({
        ...mockBankAccount,
        account: mockBankAccount.account[0],
      } as BankAccountDAO);

      expect(prismaService.bankAccount.create).toHaveBeenCalledWith({
        data: {
          name: data.name,
          type: data.type,
          balance: data.balance,
          interestRate: data.interestRate,
          account: {
            create: {
              user: {
                connect: { id: userId },
              },
              institution: data.institution,
              type: MainAccountType.BANK,
            },
          },
        },
        include: {
          account: true,
          transactions: true,
        },
      });
    });
  });

  describe('getBankAccountsForUser', () => {
    it('should return an array of bank accounts with associated transactions', async () => {
      const userId = 1;

      const mockAccounts = [
        {
          id: 1,
          name: 'Test Account 1',
          type: AccountType.CHECKING,
          balance: 1000,
          interestRate: 0.5,
          transactions: [],
          account: [
            {
              id: 1,
              userId: userId,
              type: MainAccountType.BANK,
              institution: 'Test Bank',
            },
          ],
        },
        {
          id: 2,
          name: 'Test Account 2',
          type: AccountType.SAVINGS_TFSA,
          balance: 2000,
          interestRate: 1.5,
          transactions: [],
          account: [
            {
              id: 2,
              userId: userId,
              type: MainAccountType.BANK,
              institution: 'Test Bank',
            },
          ],
        },
      ];

      prismaService.bankAccount.findMany.mockResolvedValue(mockAccounts as any);

      const result = await repository.getBankAccountsForUser(userId);

      expect(result).toEqual(
        mockAccounts.map((account) => ({
          ...account,
          account: account.account[0],
        })) as BankAccountDAO[],
      );

      expect(prismaService.bankAccount.findMany).toHaveBeenCalledWith({
        where: {
          account: {
            some: {
              userId: userId,
              type: MainAccountType.BANK,
            },
          },
        },
        include: {
          transactions: {
            include:{
              recurringCashFlow: true,
            }
          },
          account: true,
        },
      });
    });
  });

  describe('getBankAccountById', () => {
    it('should return the bank account with associated transactions', async () => {
      const accountId = 1;
      const mockAccount = {
        id: accountId,
        name: 'Test Account',
        type: AccountType.CHECKING,
        balance: 1000,
        interestRate: 0.5,
        transactions: [],
        account: [
          {
            id: 1,
            userId: 1,
            type: MainAccountType.BANK,
            institution: 'Test Bank',
          },
        ],
      };

      prismaService.bankAccount.findUnique.mockResolvedValue(mockAccount as any);

      const result = await repository.getBankAccountById(accountId);

      expect(result).toEqual({
        ...mockAccount,
        account: mockAccount.account[0],
      } as BankAccountDAO);

      expect(prismaService.bankAccount.findUnique).toHaveBeenCalledWith({
        where: { id: accountId },
        include: {
          transactions: true,
          account: true,
        },
      });
    });

    it('should return null if bank account is not found', async () => {
      const accountId = 999;

      prismaService.bankAccount.findUnique.mockResolvedValue(null);

      const result = await repository.getBankAccountById(accountId);

      expect(result).toBeNull();

      expect(prismaService.bankAccount.findUnique).toHaveBeenCalledWith({
        where: { id: accountId },
        include: {
          transactions: true,
          account: true,
        },
      });
    });
  });

  describe('updateBankAccount', () => {
    it('should update an existing bank account', async () => {
      const mockAccount = {
        id: 1,
        userId: 1,
        name: 'Updated Test Account',
        type: AccountType.SAVINGS_TFSA,
        institution: 'Test Bank',
        balance: 150,
        interestRate: 5,
      };

      prismaService.mainAccount.update.mockResolvedValue(mockAccount as any);

      const updateData = {
        name: 'Updated Test Account',
        type: AccountType.SAVINGS_TFSA,
        institution: 'Test Bank',
        balance: 150,
        interestRate: 5,
        transactions: [],
      };

      const result = await repository.updateBankAccount(1, updateData);

      expect(result).toEqual(mockAccount);
      expect(prismaService.mainAccount.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          bankAccount: {
            update: {
              type: updateData.type,
              name: updateData.name,
              balance: new Prisma.Decimal(updateData.balance).toNumber(),
              interestRate: new Prisma.Decimal(updateData.interestRate).toNumber(),
              transactions: {
                createMany: {
                  data: updateData.transactions,
                },
              },
            },
          },
        },
        include: {
          bankAccount: true,
        },
      });
    });

    it('should throw NotFoundException if the bank account does not exist', async () => {
      prismaService.mainAccount.update.mockRejectedValue(new NotFoundException('Bank account not found'));

      const updateData = {
        name: 'Updated Account',
        type: AccountType.SAVINGS_TFSA,
        institution: 'Test Bank',
        balance: 1000.0,
        interestRate: 1.5,
        transactions: [],
      };

      await expect(repository.updateBankAccount(1, updateData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteBankAccount', () => {
    it('should delete the bank account and return it', async () => {
      const accountId = 1;
      const mockAccount = {
        id: accountId,
        name: 'Test Account',
        type: AccountType.CHECKING,
        balance: 1000,
        interestRate: 0.5,
        transactions: [],
        account: [
          {
            id: 1,
            userId: 1,
            type: MainAccountType.BANK,
            institution: 'Test Bank',
          },
        ],
      };

      prismaService.bankAccount.delete.mockResolvedValue(mockAccount as any);

      const result = await repository.deleteBankAccount(accountId);

      expect(result).toEqual({
        ...mockAccount,
        account: mockAccount.account[0],
      } as BankAccountDAO);

      expect(prismaService.bankAccount.delete).toHaveBeenCalledWith({
        where: { id: accountId },
        include: {
          transactions: true,
          account: true,
        },
      });
    });
  });
});
