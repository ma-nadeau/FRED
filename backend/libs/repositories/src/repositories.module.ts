import { Module } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from './prisma.service';
import { BankAccountRepository } from './repositories/bank-account.repository';

@Module({
  providers: [
    RepositoriesService,
    PrismaService,
    UserRepository,
    BankAccountRepository,
  ],
  exports: [
    RepositoriesService,
    UserRepository,
    BankAccountRepository
  ],
})
export class RepositoriesModule {}
