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
  @PrimaryGeneratedColumn()
  id!: string

  @Column()
  income!: number

  @Column()
  expense!: number

  @Column()
  year!: Date

  @Column()
  month!: Date

  @Column()
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
