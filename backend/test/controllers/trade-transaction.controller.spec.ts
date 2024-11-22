import { Test, TestingModule } from '@nestjs/testing';
import { TradeTransactionController } from '../../src/stock-transaction/trade-transaction.controller';
import { TradeTransactionService } from '../../src/stock-transaction/trade-transaction.service';
import { SessionGuard } from '../../src/session/session.guard';
import { User } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('TradeTransactionController', () => {
  let controller: TradeTransactionController;
  let service: DeepMockProxy<TradeTransactionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeTransactionController],
      providers: [
        {
          provide: TradeTransactionService,
          useValue: mockDeep<TradeTransactionService>(),
        },
      ],
    })
      .overrideGuard(SessionGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<TradeTransactionController>(TradeTransactionController);
    service = module.get(TradeTransactionService) as DeepMockProxy<TradeTransactionService>;
  });

  describe('deleteTransaction', () => {
    const user: User = {
      id: 1,
      name: 'Test User',
      email: 'testuser@example.com',
      age: 30,
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const tradeTransactionId = 1;

    it('should delete the trade transaction successfully', async () => {
      service.deleteTradeTransaction.mockResolvedValue(undefined);

      await expect(
        controller.deleteTransaction(user, tradeTransactionId),
      ).resolves.not.toThrow();

      expect(service.deleteTradeTransaction).toHaveBeenCalledWith(
        tradeTransactionId,
        user.id,
      );
    });

    it('should throw NotFoundException when service throws NotFoundException', async () => {
      service.deleteTradeTransaction.mockRejectedValue(
        new NotFoundException('Trade transaction not found.'),
      );

      await expect(
        controller.deleteTransaction(user, tradeTransactionId),
      ).rejects.toThrow(NotFoundException);

      expect(service.deleteTradeTransaction).toHaveBeenCalledWith(
        tradeTransactionId,
        user.id,
      );
    });

    it('should throw ForbiddenException when service throws ForbiddenException', async () => {
      service.deleteTradeTransaction.mockRejectedValue(
        new ForbiddenException('Access denied.'),
      );

      await expect(
        controller.deleteTransaction(user, tradeTransactionId),
      ).rejects.toThrow(ForbiddenException);

      expect(service.deleteTradeTransaction).toHaveBeenCalledWith(
        tradeTransactionId,
        user.id,
      );
    });
  });
});