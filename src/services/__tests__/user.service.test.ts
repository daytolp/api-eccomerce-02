
// Mock completo del repositorio
const mockFindOneBy = jest.fn();
const mockFind = jest.fn();

const mockGetRepository = jest.fn(() => ({
  findOneBy: mockFindOneBy,
  find: mockFind
}));

jest.mock('../../config/database', () => ({
  AppDataSource: {
    getRepository: mockGetRepository
  }
}));

// Mock User entity
jest.mock('../../entities/user', () => ({
  User: jest.fn()
}));

import { UserService } from '../user.service.js';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService();
    // Forzar que use el mock del repositorio
    (service as any).repo = {
      findOneBy: mockFindOneBy,
      find: mockFind
    };
  });

  describe('getUserById', () => {
    test('should return user when found', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
      mockFindOneBy.mockResolvedValue(mockUser);

      const user = await service.getUserById(1);
      
      expect(user).toEqual(mockUser);
      expect(mockFindOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    test('should return null when user not found', async () => {
      mockFindOneBy.mockResolvedValue(null);

      const user = await service.getUserById(999);
      
      expect(user).toBeNull();
      expect(mockFindOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('getAllUsers', () => {
    test('should return array of users', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ];
      mockFind.mockResolvedValue(mockUsers);

      const users = await service.getAllUsers();
      
      expect(users).toEqual(mockUsers);
      expect(users).toHaveLength(2);
      expect(mockFind).toHaveBeenCalled();
    });
  });
});
