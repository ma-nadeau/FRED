import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountRepository } from '../../libs/repositories/src/repositories/bank-account.repository';
import { PrismaService } from '../../libs/repositories/src/prisma.service';
import { AccountType, MainAccountType, Prisma } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

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
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createBankAccount', () => {
    it('should create a new bank account', async () => {
      const mockAccount = {
        id: 1,
        userId: 1,
        institution: 'Test Bank',
        type: MainAccountType.BANK,
        bankAccount: {
          id: 1,
          name: 'Test Account',
          type: AccountType.CHECKING,
          balance: new Prisma.Decimal(0.0),
          interestRate: new Prisma.Decimal(0.0),
        },
      };

      prismaService.mainAccount.create.mockResolvedValue(mockAccount as any);

      const result = await repository.createBankAccount(1, {
        name: 'Test Account',
        type: AccountType.CHECKING,
        institution: 'Test Bank',
      });

      expect(result).toEqual(mockAccount);
      expect(prismaService.mainAccount.create).toHaveBeenCalledWith({
        data: {
          user: { connect: { id: 1 } },
          institution: 'Test Bank',
          type: MainAccountType.BANK,
          bankAccount: {
            create: {
              name: 'Test Account',
              type: AccountType.CHECKING,
              balance: 0.0,
              interestRate: 0.0,
            },
          },
        },
        include: { bankAccount: true },
      });
    });
  });

  describe('getBankAccountsForUser', () => {
    it('should return all bank accounts for a specific user', async () => {
      const mockAccounts = [
        {
          id: 1,
          userId: 1,
          institution: 'Test Bank',
          type: MainAccountType.BANK,
          bankAccount: {
            id: 1,
            name: 'Test Account',
            type: AccountType.CHECKING,
            balance: new Prisma.Decimal(100.0),
            transactions: [],
            interestRate: new Prisma.Decimal(0.0),
          },
        },
      ];

      prismaService.mainAccount.findMany.mockResolvedValue(mockAccounts as any);

      const result = await repository.getBankAccountsForUser(1);

      expect(result).toEqual(mockAccounts);
      expect(prismaService.mainAccount.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          type: MainAccountType.BANK,
        },
        include: {
          bankAccount: {
            include: { transactions: true },
          },
        },
      });
    });
  });

  describe('getBankAccountById', () => {
    it('should return a specific bank account by its ID', async () => {
      const mockAccount = {
        id: 1,
        userId: 1,
        institution: 'Test Bank',
        type: MainAccountType.BANK,
        bankAccount: {
          id: 1,
          name: 'Test Account',
          type: AccountType.CHECKING,
          balance: new Prisma.Decimal(100.0),
          transactions: [],
          interestRate: new Prisma.Decimal(0.0),
        },
      };

      prismaService.mainAccount.findUnique.mockResolvedValue(mockAccount as any);

      const result = await repository.getBankAccountById(1);

      expect(result).toEqual(mockAccount);
      expect(prismaService.mainAccount.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          bankAccount: {
            include: { transactions: true },
          },
        },
      });
    });
  });

  describe('deleteBankAccount', () => {
    it('should delete a specific bank account by its ID', async () => {
      const mockAccount = {
        id: 1,
        userId: 1,
        institution: 'Test Bank',
        type: MainAccountType.BANK,
      };

      prismaService.mainAccount.delete.mockResolvedValue(mockAccount as any);

      const result = await repository.deleteBankAccount(1);

      expect(result).toEqual(mockAccount);
      expect(prismaService.mainAccount.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
