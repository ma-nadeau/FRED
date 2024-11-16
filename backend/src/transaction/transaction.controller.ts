import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  HttpCode,
  Param,
  ParseIntPipe,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from '@fred/transfer-objects/dtos/transaction/create-transaction.dto';
import { TransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/transaction-response.dto';
import { FredUser } from '../session/auth.decorator';
import { User } from '@prisma/client';
import { SessionGuard } from '../session/session.guard';
import { BankAccountResponseDto } from '@fred/transfer-objects/dtos/bank-account';

@Controller('transactions')
@UseGuards(SessionGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @FredUser() user: User,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.createTransaction(
      user.id,
      createTransactionDto,
    );
  }

  @Get()
  async getBankAccountsForUser(
    @FredUser() user: User,
  ): Promise<BankAccountResponseDto[]> {
    return this.transactionService.getBankAccountsForUser(user.id);
  }

  @Delete(':transactionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @FredUser() user: User,
  ): Promise<void> {
    await this.transactionService.deleteTransaction(transactionId, user.id);
  }
}
