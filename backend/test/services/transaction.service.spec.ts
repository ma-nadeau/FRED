import { Test, TestingModule } from '@nestjs/testing';
import { Category, PrismaClient, TransactionType } from '@prisma/client';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { TransactionService } from '../../src/transaction/transaction.service';
import { CreateTransactionDto } from '../../libs/transfer-objects/src/dtos/transaction/create-transaction.dto'; // Adjust import path as needed

const mockPrisma = {
  bankAccount: {
    findUnique: jest.fn(),
  },
  transaction: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: PrismaClient,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw a ForbiddenException if the user does not own the account', async () => {
    mockPrisma.bankAccount.findUnique.mockResolvedValue({
      account: [{ userId: 2 }],
    });

    const createTransactionDto: CreateTransactionDto = {
      description: 'Test Transaction',
      type: TransactionType.DEPOSIT, // Use the enum value
      category: Category.GROCERIES, // Use the enum value
      transactionAt: new Date(),
      amount: 100,
      accountId: 1,
    };

    await expect(
      service.createTransaction(1, createTransactionDto),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw a ForbiddenException if a duplicate transaction exists', async () => {
    mockPrisma.bankAccount.findUnique.mockResolvedValue({
      account: [{ userId: 1 }],
    });

    mockPrisma.transaction.findFirst.mockResolvedValue({
      id: 1,
    });

    const createTransactionDto: CreateTransactionDto = {
      description: 'Test Transaction',
      type: TransactionType.DEPOSIT, // Use the enum value
      category: Category.GROCERIES, // Use the enum value
      transactionAt: new Date(),
      amount: 100,
      accountId: 1,
    };

    await expect(
      service.createTransaction(1, createTransactionDto),
    ).rejects.toThrow(ForbiddenException);
  });

});
