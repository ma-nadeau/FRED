import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../../src/app.module';
import { RequestLoginDTO, RequestSignupDTO } from '@fred/transfer-objects/dtos/auth';
import { PrismaService } from '@fred/repositories/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await prismaService.user.deleteMany();
    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user and return access token', async () => {
      const signupDto: RequestSignupDTO = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        age: 25
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(typeof response.body.accessToken).toBe('string');
    });

    it('should fail if email already exists', async () => {
      const signupDto: RequestSignupDTO = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        age: 25
      };

      // First signup
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);

      // Second signup with same email
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const signupDto: RequestSignupDTO = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        age: 25
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);
    });

    it('should login successfully with correct credentials', async () => {
      const loginDto: RequestLoginDTO = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(typeof response.body.accessToken).toBe('string');
    });

    it('should fail with incorrect password', async () => {
      const loginDto: RequestLoginDTO = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });
  });

  describe('GET /auth/me', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Create and login a test user
      const signupDto: RequestSignupDTO = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        age: 25
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      accessToken = loginResponse.body.accessToken;
    });

    it('should return user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('age', 25);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should fail without authentication token', async () => {
      await request(app.getHttpServer())
        .get('/auth/me')
        .expect(401);
    });
  });
});
