import axios from "axios";
import { Product } from "../entities/product.js";
import { AppDataSource } from "../config/database.js";
import { In } from "typeorm";

export class ProductExternalService {
  private repo = AppDataSource.getRepository(Product);

  async fetchExternalProducts(): Promise<{ savedIds: number[]; omittedIds: number[] }> {
    const response = await axios.get<any[]>("https://fakestoreapi.com/products");
    const products: Product[] = [];

    for (const item of response.data) {
      const product = new Product();
      product.name = item.title;
      product.price = item.price;
      product.stock = 100;
      products.push(product);
    }

    // Obtener los nombres de los productos externos
    const names = products.map((p) => p.name);

    // Consultar en la BD cuáles ya existen (por nombre)
    const existing = await this.repo.find({ where: { name: In(names) } });
    const existingNames = new Set(existing.map((e) => e.name));

    // Filtrar solo los que NO existen
    const toSave = products.filter((p) => !existingNames.has(p.name));

    // Guardar nuevos registros (si hay)
    let saved: Product[] = [];
    if (toSave.length > 0) {
      saved = await this.repo.save(toSave);
    }

    const savedIds = saved.map((s) => s.id).filter((id) => typeof id === "number");
    const omittedIds = existing.map((e) => e.id).filter((id) => typeof id === "number");

    return { savedIds, omittedIds };
  }
}
