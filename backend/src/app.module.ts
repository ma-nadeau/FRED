import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { RepositoriesModule } from '@fred/repositories/repositories.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { SessionGuard } from './session/session.guard';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { BankAccountController } from './bank/bank-account.controller';
import { BankAccountService } from './bank/bank-account.service';
import {TransactionController} from "./transaction/transaction.controller";
import {TransactionService} from "./transaction/transaction.service";
import { TradingAccountController } from './trading/trading-account.controller';
import { TradingAccountService } from './trading/trading-account.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the module available globally
    }),
    RepositoriesModule,
    MorganModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, BankAccountController, TransactionController, TradingAccountController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    AuthService,
    BankAccountService,
    TransactionService,
    TradingAccountService
      
  ],
})
export class AppModule {}
