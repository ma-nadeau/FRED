import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BankAccountService } from './bank-account.service'; // Adjust the import path as needed
import {
  CreateBankAccountDto,
  BankAccountResponseDto,
} from '@hubber/transfer-objects/dtos/bank-account';
import { FredUser } from 'src/session/auth.decorator'; // Custom decorator to get the logged-in user from the session
import { User } from '@prisma/client'; // Assuming User type from Prisma
import { SessionGuard } from 'src/session/session.guard'; // Assuming this is the guard we are using

@Controller('bank-accounts')
@UseGuards(SessionGuard) // Protect all routes with SessionGuard
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  // Create a new bank account for the currently authenticated user
  @Post()
  async createBankAccount(
    @FredUser() user: User, // Get the currently authenticated user from the request
    @Body() createBankAccountDto: CreateBankAccountDto,
  ): Promise<BankAccountResponseDto> {
    return this.bankAccountService.createBankAccount(user.id, createBankAccountDto);
  }

  // Get all bank accounts for the currently authenticated user
  @Get()
  async getBankAccountsForUser(
    @FredUser() user: User, // Get the currently authenticated user
  ): Promise<BankAccountResponseDto[]> {
    return this.bankAccountService.getBankAccountsForUser(user.id);
  }

  // Get a specific bank account by its ID, only if it belongs to the authenticated user
  @Get('account/:accountId')
  async getBankAccountById(
    @Param('accountId', ParseIntPipe) accountId: number,
    @FredUser() user: User, // Get the currently authenticated user
  ): Promise<BankAccountResponseDto> {
    return this.bankAccountService.getBankAccountById(accountId, user.id);
  }

  // Delete a specific bank account by its ID, only if it belongs to the authenticated user
  @Delete('account/:accountId')
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on successful deletion
  async deleteBankAccount(
    @Param('accountId', ParseIntPipe) accountId: number,
    @FredUser() user: User, // Get the currently authenticated user
  ): Promise<void> {
    await this.bankAccountService.deleteBankAccount(accountId, user.id);
  }
}
