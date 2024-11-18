import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  IsArray,
} from 'class-validator';
import { TradingAccountType } from '@prisma/client'; // Adjust import as needed

// DTO for creating a trading account
export class CreateTradingAccountDto {
  @IsNotEmpty({ message: 'Account Name is required' })
  @IsString({ message: 'Account Name should be a string' })
  name: string;

  @IsOptional()
  @IsNumber({}, { message: 'Initial Balance should be a number' })
  @Min(0, { message: 'Balance must be a positive number' })
  balance?: number;

  @IsNotEmpty({ message: 'Account Type is required' })
  @IsEnum(TradingAccountType, { message: 'Account Type must be valid' })
  type: TradingAccountType;
}

// DTO for updating a trading account
export class UpdateTradingAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Balance must be a positive number' })
  balance?: number;

  @IsOptional()
  @IsEnum(TradingAccountType)
  type?: TradingAccountType;

  @IsOptional()
  tradesStock?: TradeStockTransactionDto[]; // Include trades in the DTO
}

// DTO for creating a trade stock transaction
export class CreateTradeStockTransactionDto {
  @IsNotEmpty({ message: 'Trading Account ID is required' })
  @IsNumber({}, { message: 'Trading Account ID must be a number' })
  tradingAccountId: number;

  @IsNotEmpty({ message: 'Symbol is required' })
  @IsString({ message: 'Symbol should be a string' })
  symbol: string;

  @IsOptional()
  @IsNumber({}, { message: 'Purchase Price should be a number' })
  @Min(0, { message: 'Purchase Price must be a positive number' })
  purchasePrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Sell Price should be a number' })
  @Min(0, { message: 'Sell Price must be a positive number' })
  sellPrice?: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity must be a positive number' })
  quantity: number;

  @IsOptional()
  transactionAt?: Date; // Use optional for timestamp
}

// DTO for trade stock transaction in response
export class TradeStockTransactionDto {
  @IsNumber()
  id: number;

  @IsNumber()
  tradingAccountId: number;

  @IsString()
  symbol: string;

  @IsOptional()
  @IsNumber()
  purchasePrice?: number | null; // Allow null as a possible value

  @IsOptional()
  @IsNumber()
  sellPrice?: number | null; // Allow null as a possible value

  @IsNumber()
  quantity: number;

  @IsString()
  transactionAt: string; // ISO date string
}

// DTO for trading account response
export class TradingAccountResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  balance: number;

  @IsEnum(TradingAccountType)
  type: TradingAccountType;

  @IsArray()
  tradesStock: TradeStockTransactionDto[]; // Include array of TradeStockTransactionDto
}
