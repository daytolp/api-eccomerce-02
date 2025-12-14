
// Mock axios usando __esModule
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn()
  }
}));

// Mock AppDataSource
const mockFind = jest.fn();
const mockSave = jest.fn();

const mockGetRepository = jest.fn(() => ({
  find: mockFind,
  save: mockSave
}));

jest.mock('../../config/database', () => ({
  AppDataSource: {
    getRepository: mockGetRepository
  }
}));

// Mock typeorm
jest.mock('typeorm', () => ({
  In: jest.fn((values) => ({ _type: 'in', _values: values })),
  Entity: jest.fn(() => jest.fn()),
  PrimaryGeneratedColumn: jest.fn(() => jest.fn()),
  Column: jest.fn(() => jest.fn())
}));

// Mock Product entity
jest.mock('../../entities/product', () => ({
  Product: jest.fn().mockImplementation(() => ({
    name: '',
    price: 0,
    stock: 0
  }))
}));

import axios from 'axios';
import { ProductExternalService } from '../product-external.service.js';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProductExternalService', () => {
  let service: ProductExternalService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductExternalService();
    // Forzar que use el mock del repositorio
    (service as any).repo = {
      find: mockFind,
      save: mockSave
    };
  });

  describe('fetchExternalProducts', () => {
    test('should fetch, filter and save new products', async () => {
      // Setup mocks
      mockedAxios.get.mockResolvedValue({
        data: [
          { title: 'Product A', price: 10.99 },
          { title: 'Product B', price: 15.50 },
          { title: 'Product C', price: 8.25 }
        ]
      });

      mockFind.mockResolvedValue([
        { id: 1, name: 'Product A' } // Existing product
      ]);

      mockSave.mockResolvedValue([
        { id: 100, name: 'Product B', price: 15.50, stock: 100 },
        { id: 101, name: 'Product C', price: 8.25, stock: 100 }
      ]);

      const result = await service.fetchExternalProducts();
      
      expect(result).toHaveProperty('savedIds');
      expect(result).toHaveProperty('omittedIds');
      expect(Array.isArray(result.savedIds)).toBe(true);
      expect(Array.isArray(result.omittedIds)).toBe(true);
      expect(result.savedIds).toEqual([100, 101]);
      expect(result.omittedIds).toEqual([1]);
    });

    test('should handle case with no new products', async () => {
      mockedAxios.get.mockResolvedValue({
        data: [
          { title: 'Product A', price: 10.99 }
        ]
      });

      mockFind.mockResolvedValue([
        { id: 1, name: 'Product A' }
      ]);

      const result = await service.fetchExternalProducts();
      
      expect(result.savedIds).toHaveLength(0);
      expect(result.omittedIds).toEqual([1]);
    });
  });
});
