import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
import { Payment_Method } from '../utils/enums.js'

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text' })
  description!: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
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
