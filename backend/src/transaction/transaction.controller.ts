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
  HttpException,
  Put,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { FredUser } from '../session/auth.decorator';
import { User } from '@prisma/client';
import { SessionGuard } from '../session/session.guard';
import { BankAccountResponseDto } from '@fred/transfer-objects/dtos/bank-account';
import { CreateTransactionDto, TransactionResponseDto, UpdateTransactionDto } from '@fred/transfer-objects/dtos/transaction.dto';



@Controller('transactions')
@UseGuards(SessionGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

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

  // Update an existing transaction for the currently authenticated user
  @Put(':id')
  async updateTransaction(
    @FredUser() user: User,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    // try {
    return await this.transactionService.updateTransaction(
      parseInt(id),
      user.id,
      updateTransactionDto,
    );

  }

  // Get a specific transaction by its ID, only if it belongs to the authenticated user
  @Get(':id')
  async getTransactionById(
    @FredUser() user: User,
    @Param('id') id: string,
  ): Promise<TransactionResponseDto> {
    try {
      return await this.transactionService.getTransactionById(
        parseInt(id),
        user.id,
      );
    } catch (error) {


      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
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
