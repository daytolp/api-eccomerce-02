import { ProductExternalService } from './product-external.service.js';
import { ProductRepository } from './../repositories/product.repository.js';
import { Product } from './../entities/product.js';
import { HttpError } from '../errors/http-error.js';

const productRepository = new ProductRepository();
const productExternalService = new ProductExternalService();

export class ProductService {

    async getAllProducts(page: number, size: number, nativa: boolean = false): Promise<Product[]> {

        if (page < 1 || size < 1) {
            throw new HttpError(400, "Parámetros de paginación inválidos");
        }

        if (nativa) {
            return this.getAllProductsNativa(page, size);
        }

        const products = await productRepository.findAll(page, size);
        return products;
    }

    async getAllProductsNativa(page: number, size: number): Promise<Product[]> {
        console.log("Usando consulta nativa");
        const products = await productRepository.findAllNativa(page, size);
        return products;
    }

    async saveProduct(product: Product): Promise<Product> {
        return productRepository.save(product);
    }

    async fetchAndSaveExternalProducts(): Promise<{ savedIds: number[]; omittedIds: number[] }> {
        return await productExternalService.fetchExternalProducts();   
    }
}