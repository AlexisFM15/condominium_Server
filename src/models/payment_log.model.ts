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
export class Payment_log {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  note!: string

  //timestamps
  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
}
