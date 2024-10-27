import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      signup: jest.fn(),
      login: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup with correct parameters', async () => {
      const signupDto = {
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        password: 'password123'
      };

      const expectedResponse = {
        message: 'Signup successful',
        accessToken: 'test-token'
      };

      authService.signup.mockResolvedValue(expectedResponse);

      const result = await controller.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      const expectedResponse = {
        accessToken: 'test-token'
      };

      authService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });
  });
});
