import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserRepository } from '@fred/repositories/repositories/user.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userRepository: UserRepository,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getUsers() {
    return this.userRepository.findByEmail('test@test.com');
  }
}
