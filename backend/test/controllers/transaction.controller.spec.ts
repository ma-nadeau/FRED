import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../src/transaction/transaction.controller';
import { TransactionService } from '../../src/transaction/transaction.service';
import { User } from '@prisma/client'; // Assuming User type from Prisma
import { SessionGuard } from '../../src/session/session.guard'; // Adjust the import path as needed
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TransactionType, Category } from '@prisma/client';
import { CreateTransactionDto } from '@fred/transfer-objects/dtos/transaction/create-transaction.dto';
import { TransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/transaction-response.dto';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: DeepMockProxy<TransactionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockDeep<TransactionService>(),
        },
      ],
    })
      .overrideGuard(SessionGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get(
      TransactionService,
    ) as DeepMockProxy<TransactionService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTransaction', () => {
    let user: User;

    beforeEach(() => {
      user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        age: 30,
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    it('should create a transaction and return the response', async () => {
      const createTransactionDto: CreateTransactionDto = {
        amount: 100,
        description: 'This is a test transaction',
        type: TransactionType.WITHDRAWAL,
        transactionAt: new Date(),
        category: Category.GROCERIES,
        accountId: 1,
      };

      const mockResponse: TransactionResponseDto = {
        id: 1,
        description: 'This is a test transaction',
        type: TransactionType.WITHDRAWAL,
        category: Category.GROCERIES,
        transactionAt: new Date(),
        amount: 100,
        accountId: 1,
      };

      service.createTransaction.mockResolvedValue(mockResponse);

      const result = await controller.createTransaction(
        user,
        createTransactionDto,
      );

      expect(result).toEqual(mockResponse);
      expect(service.createTransaction).toHaveBeenCalledWith(
        user.id,
        createTransactionDto,
      );
    });
  });

  describe('deleteTransaction', () => {
    const user: User = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      age: 30,
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should delete a transaction when it exists and belongs to the user', async () => {
      const transactionId = 1;

      service.deleteTransaction.mockResolvedValue(undefined);

      const result = await controller.deleteTransaction(transactionId, user);

      expect(result).toBeUndefined();
      expect(service.deleteTransaction).toHaveBeenCalledWith(
        transactionId,
        user.id,
      );
    });

    it('should throw NotFoundException when the transaction does not exist', async () => {
      const transactionId = 999;

      service.deleteTransaction.mockRejectedValue(
        new NotFoundException('Transaction not found.'),
      );

      await expect(
        controller.deleteTransaction(transactionId, user),
      ).rejects.toThrow(NotFoundException);
      expect(service.deleteTransaction).toHaveBeenCalledWith(
        transactionId,
        user.id,
      );
    });

    it('should throw ForbiddenException when the user does not have permission to delete the transaction', async () => {
      const transactionId = 2;

      service.deleteTransaction.mockRejectedValue(
        new ForbiddenException(
          'You do not have permission to delete this transaction.',
        ),
      );

      await expect(
        controller.deleteTransaction(transactionId, user),
      ).rejects.toThrow(ForbiddenException);
      expect(service.deleteTransaction).toHaveBeenCalledWith(
        transactionId,
        user.id,
      );
    });
  });
});
