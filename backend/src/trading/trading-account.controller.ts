import {
    Controller,
    Get,
    Post,
    Put,
    Param,
    Body,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    ParseIntPipe,
  } from '@nestjs/common';
  import { TradingAccountService } from './trading-account.service'; // Adjust the import path as needed
  import {
    CreateTradingAccountDto,
    TradingAccountResponseDto,
    UpdateTradingAccountDto,
  } from '@fred/transfer-objects/dtos/trading-account';
  import { FredUser } from '../session/auth.decorator'; // Custom decorator to get the logged-in user from the session
  import { User } from '@prisma/client'; // Assuming User type from Prisma
  import { SessionGuard } from '../session/session.guard'; // Assuming this is the guard we are using
  
  @Controller('trading-accounts')
  @UseGuards(SessionGuard) // Protect all routes with SessionGuard
  export class TradingAccountController {
    constructor(private readonly tradingAccountService: TradingAccountService) {}
  
    // Create a new trading account for the currently authenticated user
    @Post()
    async createTradingAccount(
      @FredUser() user: User, // Get the currently authenticated user from the request
      @Body() createTradingAccountDto: CreateTradingAccountDto,
    ): Promise<TradingAccountResponseDto> {
      return this.tradingAccountService.addTradingAccount(createTradingAccountDto);
    }
  
    // Get all trading accounts for the currently authenticated user
    @Get()
    async getTradingAccountsForUser(
      @FredUser() user: User, // Get the currently authenticated user
    ): Promise<TradingAccountResponseDto[]> {
      return this.tradingAccountService.getAllTradingAccounts();
    }
  
    // Get a specific trading account by its ID
    @Get(':accountId')
    async getTradingAccountById(
      @Param('accountId', ParseIntPipe) accountId: number,
      @FredUser() user: User, // Get the currently authenticated user
    ): Promise<TradingAccountResponseDto> {
      return this.tradingAccountService.getTradingAccountById(accountId);
    }
  
    // Update an existing trading account
    @Put(':id')
    async updateTradingAccount(
      @Param('id') id: number,
      @Body() updateTradingAccountDto: UpdateTradingAccountDto,
      @FredUser() user: User, // Get the currently authenticated user
    ): Promise<TradingAccountResponseDto> {
      return this.tradingAccountService.updateTradingAccount(id, updateTradingAccountDto);
    }
  
    // Delete a specific trading account by its ID
    @Delete(':accountId')
    @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on successful deletion
    async deleteTradingAccount(
      @Param('accountId', ParseIntPipe) accountId: number,
      @FredUser() user: User, // Get the currently authenticated user
    ): Promise<void> {
      await this.tradingAccountService.deleteTradingAccount(accountId);
    }
  }
  