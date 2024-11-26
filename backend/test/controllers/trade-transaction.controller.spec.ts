import { Test, TestingModule } from '@nestjs/testing';
import { TradeTransactionController } from '../../src/stock-transaction/trade-transaction.controller';
import { TradeTransactionService } from '../../src/stock-transaction/trade-transaction.service';
import { SessionGuard } from '../../src/session/session.guard';
import { User } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ForbiddenException, HttpException, NotFoundException } from '@nestjs/common';
import { UpdateTradingTransactionDto } from '@fred/transfer-objects/dtos/transaction/update-trading-transaction.dto';
import { TradingTransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/trading-transaction.dto';

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

  describe('updateStockTransaction', () => {
    const user: User = {
      id: 1,
      name: 'Test User',
      email: 'testuser@example.com',
      age: 30,
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  
    it ('Successfully update stock information', async () => {
      const transactionId = '1'; // Define the transactionId as string since controller expects string
        const updateTradingTransactionDto: UpdateTradingTransactionDto = {
          id: 1,
          symbol: 'AAPL',
          purchasePrice: 150,
          quantity: 10,
          transactionAt: new Date(),
        };
  
        const mockResponse: TradingTransactionResponseDto = {
          id: parseInt(transactionId),
          tradingAccountId: 1,
          symbol: 'AAPL',
          purchasePrice: 150,
          quantity: 10,
          transactionAt: new Date(),
          tradingAccount: {
            id: 1,
          },
        };
  
        service.updateTradeTransaction.mockResolvedValue(mockResponse);
  
        const result = await controller.updateStockTransaction(transactionId, updateTradingTransactionDto, user);
  
        expect(result).toEqual(mockResponse);
        expect(service.updateTradeTransaction).toHaveBeenCalledWith(
          parseInt(transactionId),
          user.id,
          updateTradingTransactionDto
        );
    });
  
      it('Unsuccessfully update stock information because stock transaction does not exist', async () => {
          const transactionId = String(Number.MAX_SAFE_INTEGER);
          const updateTradingTransactionDto: UpdateTradingTransactionDto = {
          id: 1,
          symbol: 'AAPL',
          purchasePrice: 150,
          quantity: 10,
          transactionAt: new Date(),
          };
      
          service.updateTradeTransaction.mockRejectedValue(new NotFoundException('Transaction not found'));
      
          await expect(controller.updateStockTransaction(transactionId, updateTradingTransactionDto, user)).rejects.toThrowError(HttpException);
          expect(service.updateTradeTransaction).toHaveBeenCalledWith(
          parseInt(transactionId),
          user.id,
          updateTradingTransactionDto
          );
      });
  });
  
  describe('getStockTransaction', () => {
      const user: User = {
          id: 1,
          name: 'Test User',
          email: 'testuser@example.com',
          age: 30,
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
  
        it ('Successfully get stock information', async () => {
      const transactionId = '1'; // Define the transactionId as string since controller expects string
        const updateTradingTransactionDto: UpdateTradingTransactionDto = {
          id: 1,
          symbol: 'AAPL',
          purchasePrice: 150,
          quantity: 10,
          transactionAt: new Date(),
        };
  
        const mockResponse: TradingTransactionResponseDto = {
          id: parseInt(transactionId),
          tradingAccountId: 1,
          symbol: 'AAPL',
          purchasePrice: 150,
          quantity: 10,
          transactionAt: new Date(),
          tradingAccount: {
            id: 1,
          },
        };
  
        service.getTradeTransactionById.mockResolvedValue(mockResponse);
  
        const result = await controller.getStockTransaction(transactionId, user);
  
        expect(result).toEqual(mockResponse);
        expect(service.getTradeTransactionById).toHaveBeenCalledWith(
          parseInt(transactionId),
          user.id,
        );
      });
  
      it('Unsuccessfully get stock information because stock transaction does not exist', async () => {
          const transactionId = String(Number.MAX_SAFE_INTEGER);
          const updateTradingTransactionDto: UpdateTradingTransactionDto = {
          id: 1,
          symbol: 'AAPL',
          purchasePrice: 150,
          quantity: 10,
          transactionAt: new Date(),
          };
      
          service.getTradeTransactionById.mockRejectedValue(new NotFoundException('Transaction not found'));
      
          await expect(controller.getStockTransaction(transactionId, user)).rejects.toThrowError(HttpException);
          expect(service.getTradeTransactionById).toHaveBeenCalledWith(
          parseInt(transactionId),
          user.id,
          );
      });
  });
});