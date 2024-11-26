import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsDate,
  } from 'class-validator';
  
  export class UpdateTradingTransactionDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
  
    // @IsNotEmpty()
    // @IsNumber()
    // tradingAccountId: number;
    
    @IsOptional()
    @IsString()
    symbol?: string;
  
    @IsOptional()
    @IsNumber()
    purchasePrice?: number;
  
    @IsOptional()
    @IsNumber()
    sellPrice?: number;
  
    @IsOptional()
    @IsNumber()
    quantity?: number;
  
    @IsOptional()
    @IsString()
    transactionAt?: Date;
  }
  