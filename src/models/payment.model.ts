import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm'
import { Payment_Method } from '../utils/enums.js'

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  description!: string

  @Column()
  amount!: number

  @Column({ type: 'enum', enum: Payment_Method, nullable: false })
  payment_method!: string

  @Column({ type: 'date' })
  payment_date!: Date

  //timestamps
  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
}
