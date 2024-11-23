// backend/libs/transfer-objects/src/dtos/transaction.dto.ts
import {
    IsNotEmpty,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { TransactionType, TransactionCategory } from '@prisma/client';

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

export class UpdateTransactionDto {
    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsEnum(TransactionType)
    type: TransactionType;

    @IsNotEmpty()
    @IsEnum(TransactionCategory)
    category: TransactionCategory;

    @IsOptional()
    transactionAt?: Date;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsNumber()
    accountId?: number;
}

export class TransactionResponseDto {
    id: number;
    description: string;
    type: string;
    category: string;
    transactionAt: Date;
    amount: number;
    accountId: number;
}
