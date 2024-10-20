import { Controller, Get, Post, Param, Body, Delete, HttpCode, HttpStatus, ForbiddenException, UseGuards } from '@nestjs/common';
import { BankAccountService } from './bank-account.service'; // Adjust the import path as needed
import { CreateBankAccountDto, BankAccountResponseDto } from '@hubber/transfer-objects/dtos/bank-account';
import { FredUser } from 'src/session/auth.decorator'; // Custom decorator to get the logged-in user from the session
import { User } from '@prisma/client'; // Assuming User type from Prisma
import { SessionGuard } from 'src/session/session.guard'; // Assuming this is the guard we are using

@Controller('bank-accounts')
@UseGuards(SessionGuard) // Protect all routes with SessionGuard (instead of JwtAuthGuard)
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  // Create a new bank account for the currently authenticated user
  @Post()
  async createBankAccount(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @FredUser() user: User, // Get the currently authenticated user from the request
  ): Promise<BankAccountResponseDto> {
    const account = await this.bankAccountService.createBankAccount(user.id, createBankAccountDto);
    return account;
  }

  // Get all bank accounts for the currently authenticated user
  @Get()
  async getBankAccountsForUser(
    @FredUser() user: User, // Get the currently authenticated user
  ): Promise<BankAccountResponseDto[]> {
    const accounts = await this.bankAccountService.getBankAccountsForUser(user.id);
    return accounts;
  }

  // Get a specific bank account by its ID, only if it belongs to the authenticated user
  @Get('account/:accountId')
  async getBankAccountById(
    @Param('accountId') accountId: number,
    @FredUser() user: User, // Get the currently authenticated user
  ): Promise<BankAccountResponseDto> {
    const account = await this.bankAccountService.getBankAccountById(accountId, user.id);
    if (!account) {
      throw new ForbiddenException('You do not have permission to view this account');
    }
    return account;
  }

  // Delete a specific bank account by its ID, only if it belongs to the authenticated user
  @Delete('account/:accountId')
  @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on successful deletion
  async deleteBankAccount(
    @Param('accountId') accountId: number,
    @FredUser() user: User, // Get the currently authenticated user
  ): Promise<void> {
    await this.bankAccountService.deleteBankAccount(accountId, user.id);
  }
}
