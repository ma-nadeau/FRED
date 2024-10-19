import {Body, Controller, Get, Logger, Post} from '@nestjs/common';
import {
  RequestLoginDTO,
  ResponseLoginDTO,
  RequestSignupDTO,
  ResponseSignupDTO,
} from '@hubber/transfer-objects/dtos/auth';
import { AuthService } from './auth.service';
import { FredUser, Public } from 'src/session/auth.decorator';
import { UserDAO } from '@hubber/transfer-objects/daos';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @Public()
  async signup(@Body() signupDto: RequestSignupDTO): Promise<ResponseSignupDTO> {
    this.logger.log(`Received signup request: ${JSON.stringify(signupDto)}`);
    return this.authService.signup(signupDto);
  }

  @Post('/login')
  @Public()
  async login(@Body() loginDto: RequestLoginDTO): Promise<ResponseLoginDTO> {
    const { email, password } = loginDto;
    return {
      accessToken: await this.authService.login(email, password),
    };
  }

  @Get('/me')
  async me(@FredUser() user: UserDAO): Promise<UserDAO> {
    return user;
  }
}
