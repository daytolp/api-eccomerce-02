import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false, unique: true, length: 100 })
  name!: string

  @Column('decimal')
  price!: number

  @Column()
  stock!: number
}