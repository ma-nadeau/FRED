import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TradeTransactionService } from './trade-transaction.service';
import { CreateTradingTransactionDto } from '@fred/transfer-objects/dtos/transaction/create-trading-transaction.dto';
import { TradingTransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/trading-transaction.dto';
import { FredUser } from '../session/auth.decorator';
import { User } from '@prisma/client';
import { SessionGuard } from '../session/session.guard';

@Controller('trade-transactions')
@UseGuards(SessionGuard)
export class TransactionController {
  constructor(
    private readonly tradetransactionService: TradeTransactionService,
  ) {}

  @Post()
  async createTransaction(
    @FredUser() user: User,
    @Body() createTransactionDto: CreateTradingTransactionDto,
  ): Promise<TradingTransactionResponseDto> {
    try {
      return await this.tradetransactionService.createTradeTransaction(
        user.id,
        createTransactionDto,
      );
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
