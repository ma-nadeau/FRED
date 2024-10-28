import { UserRepository } from '../../libs/repositories/src/repositories/user.repository';
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // For password hashing
import { RequestSignupDTO, RequestLoginDTO } from '@fred/transfer-objects/dtos/auth';
import { UserDAO } from '@fred/transfer-objects/daos';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  // Signup service method
  async signup(signupDto: RequestSignupDTO) {
    const { name, email, age, password } = signupDto;

    // Check if email is already taken
    const isEmailTaken = await this.userRepository.isEmailTaken(email);
    if (isEmailTaken) {
      throw new ConflictException('Email is already taken');
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await this.userRepository.create(name, email, age, hashedPassword);

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Signup successful',
      accessToken,
    };
  }

  // Login service method
  async login(loginDto: RequestLoginDTO) {
    const { email, password } = loginDto;

    // Verify the user's password using the repository
    const auth = await this.userRepository.verifyPassword(email, password);
    if (!auth.success) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { user } = auth;

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  // This method verifies the password, you can use it to double-check during sensitive actions
  async verifyPassword(
    email: string,
    password: string,
  ): Promise<boolean> {
    const auth = await this.userRepository.verifyPassword(email, password);
    if (!auth.success) {
      return false;
    }

    // If the user is authenticated, return true
    return true;
  }

  async getUserCount(): Promise<number> {
    return this.userRepository.getUserCount();
  }
}
