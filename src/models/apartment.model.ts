import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm'
import { occupancyType } from '../utils/enums.js'

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn()
  id!: string

  @Column()
  number!: number

  @Column({
    type: 'enum',
    enum: occupancyType,
    default: [occupancyType.VACANT],
  })
  occupancyType!: occupancyType

  //timestamps
  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
}
