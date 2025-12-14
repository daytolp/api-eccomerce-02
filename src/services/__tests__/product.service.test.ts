
// product.service.test.ts

import { HttpError } from '../../errors/http-error.js';

// Mock ProductRepository
const mockProductRepository = {
  findAll: jest.fn(),
  findAllNativa: jest.fn(),
  save: jest.fn()
};

// Mock ProductExternalService
const mockProductExternalService = {
  fetchExternalProducts: jest.fn()
};

jest.mock('../../repositories/product.repository', () => ({
  ProductRepository: jest.fn(() => mockProductRepository)
}));

jest.mock('../product-external.service', () => ({
  ProductExternalService: jest.fn(() => mockProductExternalService)
}));

import { ProductService } from '../product.service.js';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductService();
  });

  describe('getAllProducts', () => {
    test('should throw HttpError for invalid pagination parameters', async () => {
      await expect(service.getAllProducts(0, 10)).rejects.toThrow(HttpError);
      await expect(service.getAllProducts(1, 0)).rejects.toThrow(HttpError);
      await expect(service.getAllProducts(-1, 10)).rejects.toThrow(HttpError);
    });

    test('should return products from repository when nativa is false', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product', price: 10, stock: 5 }];
      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      const result = await service.getAllProducts(1, 10, false);
      
      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.findAll).toHaveBeenCalledWith(1, 10);
    });

    test('should return native products when nativa is true', async () => {
      const mockProducts = [{ id: 2, name: 'Native Product', price: 15, stock: 3 }];
      mockProductRepository.findAllNativa.mockResolvedValue(mockProducts);

      const result = await service.getAllProducts(1, 10, true);
      
      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.findAllNativa).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('saveProduct', () => {
    test('should save and return product', async () => {
      const productData = { name: 'Test', price: 10, stock: 5 };
      const savedProduct = { id: 3, ...productData };
      mockProductRepository.save.mockResolvedValue(savedProduct);

      const result = await service.saveProduct(productData as any);
      
      expect(result).toEqual(savedProduct);
      expect(mockProductRepository.save).toHaveBeenCalledWith(productData);
    });
  });

  describe('fetchAndSaveExternalProducts', () => {
    test('should return saved and omitted IDs', async () => {
      const mockResult = { savedIds: [1, 2], omittedIds: [3, 4] };
      mockProductExternalService.fetchExternalProducts.mockResolvedValue(mockResult);

      const result = await service.fetchAndSaveExternalProducts();
      
      expect(result).toEqual(mockResult);
      expect(mockProductExternalService.fetchExternalProducts).toHaveBeenCalled();
    });
  });
});
