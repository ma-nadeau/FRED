import { Module } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from './prisma.service';
import { BankAccountRepository } from './repositories/bank-account.repository';
import { TradingAccountRepository } from './repositories/trading-account.repository';

@Module({
  providers: [
    RepositoriesService,
    PrismaService,
    UserRepository,
    BankAccountRepository,
    TradingAccountRepository
  ],
  exports: [
    RepositoriesService,
    UserRepository,
    BankAccountRepository,
    TradingAccountRepository
  ],
})
export class RepositoriesModule {}
