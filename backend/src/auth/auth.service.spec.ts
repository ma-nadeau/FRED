import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../../libs/repositories/src/repositories/user.repository';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: DeepMockProxy<UserRepository>;

  beforeEach(async () => {
    userRepository = mockDeep<UserRepository>();  // Initialize mock first

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository) as DeepMockProxy<UserRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.isEmailTaken.mockResolvedValue(false);
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.signup({
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        password: 'password123'
      });

      expect(result).toEqual({
        accessToken: 'test-token',
        message: 'Signup successful',
      });
    });

    it('should throw error if email is already taken', async () => {
      userRepository.isEmailTaken.mockResolvedValue(true);

      await expect(service.signup({
        name: 'Test User',
        email: 'existing@example.com',
        age: 25,
        password: 'password123'
      })).rejects.toThrow('Email is already taken');
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.verifyPassword.mockResolvedValue({ success: true, user: mockUser });

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result).toEqual({
        accessToken: 'test-token',
      });
    });

    it('should throw UnauthorizedException with incorrect credentials', async () => {
      userRepository.verifyPassword.mockResolvedValue({ success: false });

      await expect(service.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow(UnauthorizedException);
    });
  });
});
