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
  id!: string

  @Column()
  amount!: number

  @Column({ type: 'enum', enum: BillStatus, default: [BillStatus.PENDING] })
  status!: BillStatus

  @Column({ type: 'date' })
  due_date!: Date

  @Column({ nullable: false })
  year!: string

  @Column({ nullable: false })
  month!: string

  @Column()
  gas_pic!: string

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
