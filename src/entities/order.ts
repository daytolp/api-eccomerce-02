import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.js";
import { User } from "./user.js";

@Entity({name: "orders"})
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.orders)
  user!: User;

  @ManyToOne(() => Product)
  product!: Product;

  @Column()
  quantity!: number;
}
