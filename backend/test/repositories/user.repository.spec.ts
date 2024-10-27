import { UserRepository } from '../../libs/repositories/src/repositories/user.repository';
import { PrismaService } from '../../libs/repositories/src/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { UserDAO } from '@hubber/transfer-objects/daos';
import { User } from '@prisma/client';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prismaService = module.get(PrismaService) as DeepMockProxy<PrismaService>;
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };


      prismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await repository.findById(1);
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        age: mockUser.age
      });
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, name: true, email: true, age: true }
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.user.create.mockResolvedValue(mockUser);

      const result = await repository.create(
        mockUser.name,
        mockUser.email,
        mockUser.age,
        'password123'
      );

      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: mockUser.name,
          email: mockUser.email,
          age: mockUser.age,
          password: 'password123'
        }
      });
    });
  });

  describe('updateName', () => {
    it('should update user name', async () => {
      const mockUser: User = {
        id: 1,
        name: 'Updated Name',
        email: 'test@example.com',
        age: 25,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.user.update.mockResolvedValue(mockUser);

      const result = await repository.updateName(1, 'Updated Name');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated Name' }
      });
    });
  });

  describe('isEmailTaken', () => {
    it('should return true if email exists', async () => {
      prismaService.user.findUnique.mockResolvedValue({ id: 1, email: 'test@example.com' } as User);
      
      const result = await repository.isEmailTaken('test@example.com');
      expect(result).toBe(true);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
    });

    it('should return false if email does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      
      const result = await repository.isEmailTaken('nonexistent@example.com');
      expect(result).toBe(false);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' }
      });
    });
  });
});
