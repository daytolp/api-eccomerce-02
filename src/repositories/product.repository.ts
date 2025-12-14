import { AppDataSource } from "../config/database.js";
import { Product } from "../entities/product.js";

export class ProductRepository {
      private repo = AppDataSource.getRepository(Product);

      async findAll(page: number, size: number): Promise<Product[]> {
          const skip = (page - 1) * size;
          return this.repo.find({
              skip: skip,
              take: size
          });
      }

      async findAllNativa(page: number, size: number): Promise<Product[]> {
          const skip = (page - 1) * size;
          return this.repo.query(
              'SELECT * FROM products LIMIT $1 OFFSET $2',
              [size, skip]
          );
      }

        async save(product: Product): Promise<Product> {
            return this.repo.save(product);
        }
}
