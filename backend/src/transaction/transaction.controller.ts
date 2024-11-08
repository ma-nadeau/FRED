import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from '@fred/transfer-objects/dtos/transaction/create-transaction.dto';
import { TransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/transaction-response.dto';
import { FredUser } from '../session/auth.decorator';
import { User } from '@prisma/client';
import { SessionGuard } from '../session/session.guard';

@Controller('transactions')
@UseGuards(SessionGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @FredUser() user: User,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    try {
      return await this.transactionService.createTransaction(
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
