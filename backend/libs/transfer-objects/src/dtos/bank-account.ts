import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { AccountType, TransactionType } from '@prisma/client';

// DTO for creating a bank account
export class CreateBankAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(AccountType)
  type: AccountType;

  @IsNotEmpty() // Ensure institution is included in the DTO
  @IsString()
  institution: string;

  @IsOptional() //optional initial balance
  @IsNumber()
  balance?: number;

  @IsOptional() //optional interest rate
  @IsNumber()
  interestRate?: number;
}

// DTO for updating a bank account
export class UpdateBankAccountDto {
  @IsOptional() // Optional for update
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AccountType) // Use enum for type
  type?: AccountType;
}

// Transaction DTO for the response
export class TransactionDto {
  @IsNumber()
  id: number;

  @IsNumber()
  accountId: number;

  @IsNumber()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional() // Description is optional
  @IsString()
  description?: string;

  @IsString()
  transactionAt: string; // ISO date string (ensure it's a string in the response)
}

// DTO for bank account response (when returning data to the frontend)
export class BankAccountResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEnum(AccountType) // Ensure it returns AccountType enum
  type: AccountType;

  @IsNumber()
  balance: number;

  @IsNumber() // Include interest rate in the response
  interestRate: number;

  transactions: TransactionDto[]; // Include array of TransactionDto
}
