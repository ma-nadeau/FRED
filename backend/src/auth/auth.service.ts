import { UserRepository } from '@fred/repositories/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { RequestSignupDTO } from '@hubber/transfer-objects/dtos/auth';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signup(signupDto: RequestSignupDTO) {
    const { name, email, age, password } = signupDto;

    const isEmailTaken = await this.userRepository.isEmailTaken(email);
    if (isEmailTaken) {
      throw new UnauthorizedException('Email is already taken');
    }

    const user = await this.userRepository.create(name, email, age, password);

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return {
      message: 'Signup successful',
      accessToken,
    };
  }
  async login(email: string, password: string) {
    const auth = await this.userRepository.verifyPassword(email, password);
    const { success } = auth;
    if (!success) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { user } = auth;

    const generateAccessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return generateAccessToken;
  }
}
