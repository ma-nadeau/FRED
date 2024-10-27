import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { AccountType, TransactionType } from '@prisma/client';

// DTO for creating a bank account
export class CreateBankAccountDto {
  @IsNotEmpty({message: 'Account Name is required'})
  @IsString({message: 'Account Name should be a string'})
  name: string;

  @IsNotEmpty({message: 'Account Type is required'})
  @IsEnum(AccountType)
  type: AccountType;

  @IsNotEmpty({message: 'Institution is required'}) // Ensure institution is included in the DTO
  @IsString({message: 'Institution should be a string'})
  institution: string;

  @IsOptional() //optional initial balance
  @IsNumber({},{message: 'Initial Balance should be a number'})
  balance?: number;

  @IsOptional() //optional interest rate
  @IsNumber({},{message: 'Interest Rate should be a number'})
  @Min(0, {message: 'Interest Rate must be a positive number'})
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
