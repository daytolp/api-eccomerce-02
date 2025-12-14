import { Router } from "express"
import { ProductController } from "../controllers/product.controller.js"
import { UserController } from "../controllers/user.controller.js"

const userController = new UserController();
const productController = new ProductController();

const router = Router();

router.get('/products', productController.getProducts);
router.get('/products/external', productController.getProductsExternal);
router.post('/products', productController.saveProduct);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);

export default router