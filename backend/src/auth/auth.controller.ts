import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestLoginDTO, ResponseLoginDTO, RequestSignupDTO, ResponseSignupDTO } from '../../libs/transfer-objects/src/dtos/auth'; // Adjust import path as needed
import { FredUser, Public } from 'src/session/auth.decorator';
import { UserDAO } from '@hubber/transfer-objects/daos';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // Signup API - Allows a user to create a new account
  @Post('/signup')
  @Public() // No authentication needed
  async signup(@Body() signupDto: RequestSignupDTO): Promise<ResponseSignupDTO> {
    this.logger.log(`Received signup request: ${JSON.stringify(signupDto)}`);
    return this.authService.signup(signupDto);
  }

  // Login API - Authenticates a user and returns an access token
  @Post('/login')
  @Public() // No authentication needed
  async login(@Body() loginDto: RequestLoginDTO): Promise<ResponseLoginDTO> {
    this.logger.log(`Received login request for email: ${loginDto.email}`);
    const { accessToken } = await this.authService.login(loginDto); // Destructure the accessToken from the object
    return { accessToken }; // Return an object with accessToken
  }


  // Me API - Returns the currently authenticated user's details
  @Get('/me')
  async me(@FredUser() user: UserDAO): Promise<UserDAO> {
    this.logger.log(`Fetching details for user: ${user.email}`);
    return user;
  }
}
