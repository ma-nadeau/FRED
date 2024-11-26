import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  UseGuards,
  HttpStatus,
  HttpException,
  Delete,
  Param,
} from '@nestjs/common';
import { TradeTransactionService } from './trade-transaction.service';
import { CreateTradingTransactionDto } from '@fred/transfer-objects/dtos/transaction/create-trading-transaction.dto';
import { TradingTransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/trading-transaction.dto';
import { UpdateTradingTransactionDto } from '@fred/transfer-objects/dtos/transaction/update-trading-transaction.dto';
import { FredUser } from '../session/auth.decorator';
import { User } from '@prisma/client';
import { SessionGuard } from '../session/session.guard';

@Controller('trade-transactions')
@UseGuards(SessionGuard)
export class TradeTransactionController {
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

  @Delete(':id')
  async deleteTransaction(
    @FredUser() user: User,
    @Param('id') id: number,
  ): Promise<void> {
    await this.tradetransactionService.deleteTradeTransaction(id, user.id);
  }

  @Put(':id')
  async updateStockTransaction(
    @Param('id') id: string,
    @Body() UpdateTradingTransactionDto: UpdateTradingTransactionDto,
    @FredUser() user: User, // Get the currently authenticated user
  ): Promise<TradingTransactionResponseDto>{
    try {
      console.log('Updating stock trade transaction with id------:', id);
      return await this.tradetransactionService.updateTradeTransaction(
        parseInt(id),
        user.id,
      UpdateTradingTransactionDto,
      );
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
  }
}

  @Get(':id')
  async getStockTransaction(
    @Param('id') id: string,
    @FredUser() user: User,
  ): Promise<TradingTransactionResponseDto> {
    try {
      
      console.log('Fetching stock trade transaction with id------:', id);
      const result = await this.tradetransactionService.getTradeTransactionById(
        parseInt(id),
        user.id,
      );
      console.log('Stock trade transaction fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
