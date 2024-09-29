import { Module } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    RepositoriesService,
    PrismaService,
    UserRepository,
  ],
  exports: [
    RepositoriesService,
    UserRepository,
  ],
})
export class RepositoriesModule {}
