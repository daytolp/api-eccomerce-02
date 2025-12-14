import type { Request, Response } from "express";
import { ProductService } from "../services/product.service.js";


const productService = new ProductService();

export class ProductController {

    async getProducts(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const size = parseInt(req.query.size as string) || 10;
            const nativa = req.query.nativa === 'true';
            
            const products = await productService.getAllProducts(page, size, nativa);
            res.status(200).json(products);
        } catch (error: any) {
            console.error("Error al obtener los productos:", error);
            if (error && typeof error.statusCode === 'number') 
                res.status(error.statusCode).json({ message: error.message });
            else
                res.status(500).json({ message: "Error al obtener los productos" });
        }
    }

    async getProductsExternal(req: Request, res: Response): Promise<void> {
        try {
            const products = await productService.fetchAndSaveExternalProducts();
            res.status(200).json(products);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            res.status(500).json({ message: "Error al obtener los productos" });
        }
    }


    
    async saveProduct(req: Request, res: Response): Promise<void> {
        try {
            const producto = req.body;
            
            const productSave = await productService.saveProduct(producto);
            res.status(201).json(productSave);
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            res.status(500).json({ message: "Error al guardar el producto" });
        }
    }
}