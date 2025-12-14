import { DataSource } from "typeorm";
import { Product } from "../entities/product.js";
import { Order } from "../entities/order.js";
import { User } from "../entities/user.js";
console.log("host", process.env.DB_HOST);


export const AppDataSource = new DataSource({   
  type: 'postgres',
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
  synchronize: true,
  logging: true,
  entities: [User, Product, Order]
});