import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { RepositoriesModule } from '@fred/repositories/repositories.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { SessionGuard } from './session/session.guard';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the module available globally
    }),
    RepositoriesModule,
    MorganModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
    JwtService,
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    AuthService,
  ],
})
export class AppModule {}
