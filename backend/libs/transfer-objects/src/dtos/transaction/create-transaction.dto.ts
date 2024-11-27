// backend/libs/transfer-objects/src/dtos/transaction/create-transaction.dto.ts
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionType, TransactionCategory, TradeStockTransaction } from '@prisma/client';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @IsNotEmpty()
  transactionAt: Date;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  accountId?: number;
}
