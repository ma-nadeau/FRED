import { Test, TestingModule } from '@nestjs/testing';
import { TransactionCategory, PrismaClient, TransactionType } from '@prisma/client';
import { PrismaService } from '@fred/repositories/prisma.service';
import { ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../src/transaction/transaction.service';
import { CreateTransactionDto, TransactionResponseDto, UpdateTransactionDto } from '@fred/transfer-objects/dtos/transaction.dto';



const mockPrisma = {
  bankAccount: {
    findUnique: jest.fn(),
  },
  transaction: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: PrismaService,
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
      account: [{ userId: 999 }],
    });

    const createTransactionDto: CreateTransactionDto = {
      description: 'Test Transaction',
      type: TransactionType.DEPOSIT, // Use the enum value
      category: TransactionCategory.GROCERIES, // Use the enum value
      transactionAt: new Date(),
      amount: 100,
      accountId: 1,
    };

    await expect(
      service.createTransaction(1, createTransactionDto),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw a BadRequestException if a duplicate transaction exists', async () => {
    mockPrisma.bankAccount.findUnique.mockResolvedValue({
      account: [{ userId: 1 }],
    });

    mockPrisma.transaction.findFirst.mockResolvedValue({
      id: 1,
      description: 'Test Transaction',
      type: TransactionType.DEPOSIT,
      category: TransactionCategory.GROCERIES,
      amount: 100,
      accountId: 1,
      transactionAt: new Date(),
    });

    const createTransactionDto: CreateTransactionDto = {
      description: 'Test Transaction',
      type: TransactionType.DEPOSIT, // Use the enum value
      category: TransactionCategory.GROCERIES, // Use the enum value
      transactionAt: new Date(),
      amount: 100,
      accountId: 1,
    };

    await expect(
      service.createTransaction(1, createTransactionDto),
    ).rejects.toThrow(BadRequestException);
  });



  describe('updateTransaction', () => {
    const userId = 1;
    const transactionId = 1;
    const updateTransactionDto: UpdateTransactionDto = {
      description: 'Updated Transaction',
      type: TransactionType.DEPOSIT,
      category: TransactionCategory.GROCERIES,
      amount: 150,
      transactionAt: new Date(),
    };

    it('should throw NotFoundException when the transaction does not exist', async () => {
      // Mock the prisma findUnique to return null (transaction not found)
      mockPrisma.transaction.findUnique.mockResolvedValue(null);

      // Test that the service throws NotFoundException
      await expect(
        service.updateTransaction(transactionId, userId, updateTransactionDto)
      ).rejects.toThrow(NotFoundException);


      // Verify that update was never called since transaction wasn't found
      expect(mockPrisma.transaction.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when the user does not have permission to update the transaction', async () => {
      // Mock finding the transaction
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: transactionId,
        accountId: 1,
        description: 'Original Transaction',
        type: TransactionType.DEPOSIT,
        category: TransactionCategory.GROCERIES,
        amount: 100,
        transactionAt: new Date(),
      });

      // mock the bank account with a different user ID
      mockPrisma.bankAccount.findUnique.mockResolvedValue({
        id: 1,
        account: [
          {
            userId: 999 // different user ID than the one making the request
          }
        ]
      });

      // test that the service throws ForbiddenException
      await expect(
        service.updateTransaction(transactionId, userId, updateTransactionDto)
      ).rejects.toThrow(ForbiddenException);


      // Verify that update was never called since permission was denied
      expect(mockPrisma.transaction.update).not.toHaveBeenCalled();


    });
  });

  // delete
  describe('deleteTransaction', () => {
    const userId = 1;
    const transactionId = 1;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully delete a transaction when user has permission', async () => {
      // mock finding the transaction with its account
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: transactionId,
        accountId: 1,
        account: {
          id: userId // This matches the userId, indicating ownership
        }
      });

      // mock successful deletion
      mockPrisma.transaction.delete.mockResolvedValue(undefined);

      // execute delete and expect no errors
      await expect(
        service.deleteTransaction(transactionId, userId)
      ).resolves.not.toThrow();

      // verify delete was called with correct parameters
      expect(mockPrisma.transaction.delete).toHaveBeenCalledWith({
        where: { id: transactionId }
      });
    });

    it('should throw NotFoundException when transaction does not exist', async () => {
      // mock transaction not found
      mockPrisma.transaction.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteTransaction(transactionId, userId)
      ).rejects.toThrow(NotFoundException);

      // verify delete was never called
      expect(mockPrisma.transaction.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user does not own the transaction', async () => {
      // mock finding the transaction but with different user ID
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: transactionId,
        accountId: 1,
        account: {
          id: 999 // different from userId
        }
      });

      await expect(
        service.deleteTransaction(transactionId, userId)
      ).rejects.toThrow(ForbiddenException);

      // verify delete was never called
      expect(mockPrisma.transaction.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when transaction has no associated account', async () => {
      // mock finding the transaction but with no account
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: transactionId,
        accountId: 1,
        account: null
      });

      await expect(
        service.deleteTransaction(transactionId, userId)
      ).rejects.toThrow(ForbiddenException);

      // verify delete was never called
      expect(mockPrisma.transaction.delete).not.toHaveBeenCalled();
    });

    it('should handle database errors during deletion', async () => {
      // Mock finding the transaction
      mockPrisma.transaction.findUnique.mockResolvedValue({
        id: transactionId,
        accountId: 1,
        account: {
          id: userId
        }
      });

      // mock deletion failure
      mockPrisma.transaction.delete.mockRejectedValue(new Error('Database error'));

      await expect(
        service.deleteTransaction(transactionId, userId)
      ).rejects.toThrow('Database error');
    });
  });
})