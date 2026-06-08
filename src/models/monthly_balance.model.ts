import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { Movement } from './movement.model.js'

@Entity()
export class Montlhy_balance {
  @PrimaryGeneratedColumn('identity')
  id!: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  income!: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  expense!: number

  @Column({ type: 'varchar' })
  year!: string

  @Column({ type: 'varchar' })
  month!: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number

  //

  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
  @OneToMany(() => Movement, (movement) => movement.monthly_balance)
  movement!: Movement[]
}
