import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { BillStatus } from '../utils/enums.js'
import { Apartment } from './apartment.model.js'

@Entity()
export class Bill {
  @PrimaryGeneratedColumn('identity')
  id!: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number

  @Column({ type: 'enum', enum: BillStatus, default: [BillStatus.PENDING] })
  status!: BillStatus

  @Column({ type: 'date' })
  due_date!: Date

  @Column({ nullable: false, type: 'varchar' })
  year!: string

  @Column({ nullable: false, type: 'varchar' })
  month!: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gas_metric!: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gas_total!: number

  @Column({ type: 'varchar' })
  gas_pic!: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  latefee!: number

  @Column({ type: 'boolean', default: false })
  lateFeeStatus!: boolean

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  credited_amount!: number
  //timestamps

  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations

  @ManyToOne(() => Apartment, (apartment) => apartment.bill)
  apartment!: Apartment
}
