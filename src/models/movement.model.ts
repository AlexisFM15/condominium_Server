import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { MovemntType } from '../utils/enums.js'
import { Montlhy_balance } from './monthly_balance.model.js'

@Entity()
export class Movement {
  @PrimaryGeneratedColumn()
  id!: string

  @Column({ type: 'enum', enum: MovemntType, nullable: false })
  name!: MovemntType

  @Column({ type: 'text' })
  description!: string // take from service and payment tables to complete this

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number

  @Column({ type: 'date' })
  date!: Date

  //timestamps

  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations

  @ManyToOne(
    () => Montlhy_balance,
    (monthly_balance) => monthly_balance.movement,
  )
  monthly_balance!: Montlhy_balance
}
