import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  // Mock existing users in the system
  const existingUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'jdoe@test.com',
      age: 25,
      password: 'Password1#',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-02-02'),
    },
    {
      id: 2,
      name: 'Jane Deer',
      email: 'jdeer@email.ca',
      age: 64,
      password: 'Password2#',
      createdAt: new Date('2022-06-07'),
      updatedAt: new Date('2024-06-07'),
    },
  ];

  beforeEach(async () => {
    const mockAuthService = {
      signup: jest.fn(),
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

  describe('Successfully create a new user account', () => {
    const testCases = [
      {
        name: 'Sebastian Reinhardt',
        email: 'sreinhardt@testemail.ca',
        age: 19,
        password: 'tEstpass12!',
      },
      {
        name: 'J Cole',
        email: 'jcole@gmail.com',
        age: 33,
        password: 'p4sswOrd!',
      },
      {
        name: 'Lionel Messi',
        email: 'lmessi@bdor.com',
        age: 45,
        password: 'B3st3ver!',
      },
    ];

    testCases.forEach((testCase) => {
      it(`should create account for ${testCase.name}`, async () => {
        const expectedResponse = {
          message: 'User created successfully',
          accessToken: 'mock-jwt-token'
        };

        authService.signup.mockResolvedValue(expectedResponse);
        
        const result = await controller.signup(testCase);
        
        expect(result).toEqual(expectedResponse);
        expect(authService.signup).toHaveBeenCalledWith(testCase);
        expect(await authService.getUserCount()).toBe(2);
      });
    });
  });

  describe('Unsuccessfully create a new user account', () => {
    describe('Missing name validation', () => {
      const testCases = [
        {
          name: '',
          email: 'sreinhardtUN1@testemail.ca',
          age: 19,
          password: 'tEstpass12!',
        },
        {
          name: '',
          email: 'jcoleUN1@gmail.com',
          age: 33,
          password: 'p4sswOrd!',
        },
        {
          name: '',
          email: 'lmessiUN1@bdor.com',
          age: 45,
          password: 'B3st3ver!',
        },
      ];

      testCases.forEach((testCase) => {
        it(`should fail when creating account with email ${testCase.email}`, async () => {
          authService.signup.mockRejectedValue(new BadRequestException('Name is required'));

          await expect(controller.signup(testCase)).rejects.toThrow('Name is required');
          expect(await authService.getUserCount()).toBe(2);
        });
      });
    });

    describe('Missing email validation', () => {
      const testCases = [
        {
          name: 'Sebastian Reinhardt',
          email: '',
          age: 19,
          password: 'tEstpass12!',
        },
        {
          name: 'J Cole',
          email: '',
          age: 33,
          password: 'p4sswOrd!',
        },
        {
          name: 'Lionel Messi',
          email: '',
          age: 45,
          password: 'B3st3ver!',
        },
      ];

      testCases.forEach((testCase) => {
        it(`should fail when creating account for ${testCase.name}`, async () => {
          authService.signup.mockRejectedValue(new BadRequestException('Email is required'));

          await expect(controller.signup(testCase)).rejects.toThrow('Email is required');
          expect(await authService.getUserCount()).toBe(2);
        });
      });
    });

    describe('Missing age validation', () => {
      const testCases = [
        {
          name: 'Sebastian Reinhardt',
          email: 'sreinhardtUN2@testemail.ca',
          age: null,
          password: 'tEstpass12!',
        },
        {
          name: 'J Cole',
          email: 'jcoleUN2@gmail.com',
          age: null,
          password: 'p4sswOrd!',
        },
        {
          name: 'Lionel Messi',
          email: 'lmessiUN2@bdor.com',
          age: null,
          password: 'B3st3ver!',
        },
      ];

      testCases.forEach((testCase) => {
        it(`should fail when creating account for ${testCase.name}`, async () => {
          authService.signup.mockRejectedValue(new BadRequestException('age is required'));

          await expect(controller.signup({
            name: testCase.name,
            email: testCase.email,
            age: testCase.age as unknown as number,
            password: testCase.password
          })).rejects.toThrow('age is required');
          expect(await authService.getUserCount()).toBe(2);
        });
      });
    });

    describe('Missing password validation', () => {
      const testCases = [
        {
          name: 'Sebastian Reinhardt',
          email: 'sreinhardtUN2@testemail.ca',
          age: 19,
          password: '',
        },
        {
          name: 'J Cole',
          email: 'jcoleUN2@gmail.com',
          age: 33,
          password: '',
        },
        {
          name: 'Lionel Messi',
          email: 'lmessiUN2@bdor.com',
          age: 45,
          password: '',
        },
      ];

      testCases.forEach((testCase) => {
        it(`should fail when creating account for ${testCase.name}`, async () => {
          authService.signup.mockRejectedValue(new BadRequestException('Password is required'));

          await expect(controller.signup(testCase)).rejects.toThrow('Password is required');
          expect(await authService.getUserCount()).toBe(2);
        });
      });
    });

    describe('Duplicate email validation', () => {
      it('should fail when creating account with existing email', async () => {
        const testCase = {
          name: 'Sebastian Reinhardt',
          email: 'jdoe@test.com',
          age: 19,
          password: 'tEstpass12!',
        };

        authService.signup.mockRejectedValue(
          new ConflictException('Email is already associated with an account')
        );

        await expect(controller.signup(testCase)).rejects.toThrow(
          'Email is already associated with an account'
        );
        expect(await authService.getUserCount()).toBe(2);
      });
    });
  });
});
