import { Module } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from './prisma.service';
import { BankAccountRepository } from './repositories/bank-account.repository';
import { TradingAccountRepository } from './repositories/trading-account.repository';
import { TradingTransactionResponseDto } from '@fred/transfer-objects/dtos/transaction/trading-transaction.dto';

@Module({
  providers: [
    RepositoriesService,
    PrismaService,
    UserRepository,
    BankAccountRepository,
    TradingAccountRepository,
  ],
  exports: [
    RepositoriesService,
    PrismaService,
    UserRepository,
    BankAccountRepository,
    TradingAccountRepository
  ],
})
export class RepositoriesModule { }
