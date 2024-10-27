import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthController (Login)', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  // Mock existing users in the system
  const existingUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'jdoe@test.com',
      age: 19,
      password: 'Password1#',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-02-02'),
    },
    {
      id: 2,
      name: 'Jane Deer', 
      email: 'jdeer@email.ca',
      age: 33,
      password: 'Password2#',
      createdAt: new Date('2022-06-07'),
      updatedAt: new Date('2024-06-07'),
    },
  ];

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      getUserCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);

    // Mock getUserCount default response
    authService.getUserCount.mockResolvedValue(existingUsers.length);
  });

  describe('Successfully log in to an existing account', () => {
    const testCases = [
      {
        email: 'jdoe@test.com',
        password: 'Password1#',
      },
      {
        email: 'jdeer@email.ca',
        password: 'Password2#',
      }
    ];

    testCases.forEach((testCase) => {
      it(`should login with email ${testCase.email}`, async () => {
        const expectedResponse = {
          accessToken: 'mock-jwt-token'
        };

        authService.login.mockResolvedValue(expectedResponse);
        
        const result = await controller.login(testCase);
        
        expect(result).toEqual(expectedResponse);
        expect(authService.login).toHaveBeenCalledWith(testCase);
        expect(await authService.getUserCount()).toBe(2);
      });
    });
  });

  describe('Unsuccessfully log in with incorrect password', () => {
    const testCases = [
      {
        email: 'jdoe@test.com',
        password: 'wrong',
      },
      {
        email: 'jdeer@email.ca',
        password: 'wrong',
      }
    ];

    testCases.forEach((testCase) => {
      it(`should fail login with email ${testCase.email}`, async () => {
        authService.login.mockRejectedValue(new UnauthorizedException('Incorrect name, email or password'));

        await expect(controller.login(testCase)).rejects.toThrow('Incorrect name, email or password');
        expect(await authService.getUserCount()).toBe(2);
      });
    });
  });

  describe('Unsuccessfully log in with incorrect email', () => {
    const testCases = [
      {
        email: 'wrong@wrong.com',
        password: 'Password1#',
      },
      {
        email: 'nogood@email.org',
        password: 'Password2#',
      }
    ];

    testCases.forEach((testCase) => {
      it(`should fail login with email ${testCase.email}`, async () => {
        authService.login.mockRejectedValue(new UnauthorizedException('Incorrect name, email or password'));

        await expect(controller.login(testCase)).rejects.toThrow('Incorrect name, email or password');
        expect(await authService.getUserCount()).toBe(2);
      });
    });
  });

  describe('Unsuccessfully log in with missing email', () => {
    const testCases = [
      {
        email: '',
        password: 'Password1#',
      },
      {
        email: '',
        password: 'Password2#',
      }
    ];

    testCases.forEach((testCase) => {
      it('should fail login with missing email', async () => {
        authService.login.mockRejectedValue(new BadRequestException('Email is required'));

        await expect(controller.login(testCase)).rejects.toThrow('Email is required');
        expect(await authService.getUserCount()).toBe(2);
      });
    });
  });
});
