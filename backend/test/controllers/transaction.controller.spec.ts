import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../src/transaction/transaction.controller';
import { TransactionService } from '../../src/transaction/transaction.service';
import { User } from '@prisma/client'; // Assuming User type from Prisma
import { SessionGuard } from '../../src/session/session.guard'; // Adjust the import path as needed
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ForbiddenException, HttpException, NotFoundException } from '@nestjs/common';
import { TransactionType, TransactionCategory } from '@prisma/client';
import { CreateTransactionDto, TransactionResponseDto, UpdateTransactionDto } from '@fred/transfer-objects/dtos/transaction.dto';


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
        category: TransactionCategory.GROCERIES,
        accountId: 1,
      };

      const mockResponse: TransactionResponseDto = {
        id: 1,
        description: 'This is a test transaction',
        type: TransactionType.WITHDRAWAL,
        category: TransactionCategory.GROCERIES,
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




  describe('updateTransaction', () => {
    const user: User = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      age: 30,
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Successfully update
    it('should update a transaction when it exists and belongs to the user', async () => {
      const transactionId = '1'; // Define the transactionId as string since controller expects string
      const updateTransactionDto: UpdateTransactionDto = {
        description: 'Updated Transaction',
        type: TransactionType.DEPOSIT,
        category: TransactionCategory.GROCERIES,
        amount: 150,
        transactionAt: new Date(),
      };

      const mockResponse: TransactionResponseDto = {
        id: parseInt(transactionId),
        description: 'Updated Transaction',
        type: TransactionType.DEPOSIT,
        category: TransactionCategory.GROCERIES,
        transactionAt: new Date(),
        amount: 150,
        accountId: 1,
      };

      service.updateTransaction.mockResolvedValue(mockResponse);

      const result = await controller.updateTransaction(
        user,
        transactionId,
        updateTransactionDto
      );

      expect(result).toEqual(mockResponse);
      expect(service.updateTransaction).toHaveBeenCalledWith(
        parseInt(transactionId),
        user.id,
        updateTransactionDto
      );
    });

    // Unsuccessfully update due to transaction not existing
    it('should throw NotFoundException when the transaction does not exist', async () => {
      const transactionId = String(Number.MAX_SAFE_INTEGER);
      const updateTransactionDto: UpdateTransactionDto = {
        description: 'Updated Transaction',
        type: TransactionType.DEPOSIT,
        category: TransactionCategory.GROCERIES,
        amount: 150,
        transactionAt: new Date(),
      };

      service.updateTransaction.mockRejectedValue(
        new NotFoundException('Transaction not found')
      );

      await expect(
        controller.updateTransaction(user, transactionId, updateTransactionDto)
      ).rejects.toThrow(NotFoundException);

      expect(service.updateTransaction).toHaveBeenCalledWith(
        parseInt(transactionId),
        user.id,
        updateTransactionDto
      );
    });

    // Unsuccessfully update due to forbidden access
    it('should throw ForbiddenException when the user does not have permission to update the transaction', async () => {
      const transactionId = '1';
      const updateTransactionDto: UpdateTransactionDto = {
        description: 'Updated Transaction',
        type: TransactionType.DEPOSIT,
        category: TransactionCategory.GROCERIES,
        amount: 150,
        transactionAt: new Date(),
      };

      service.updateTransaction.mockRejectedValue(
        new ForbiddenException('You do not have access to this transaction')
      );

      await expect(
        controller.updateTransaction(user, transactionId, updateTransactionDto)
      ).rejects.toThrow(ForbiddenException);

      expect(service.updateTransaction).toHaveBeenCalledWith(
        parseInt(transactionId),
        user.id,
        updateTransactionDto
      );
    });
  });
})