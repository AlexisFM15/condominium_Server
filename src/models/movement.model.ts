import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
import { MovemntType } from '../utils/enums.js'

@Entity()
export class Movement {
  @PrimaryGeneratedColumn()
  id!: string

  @Column({ type: 'enum', enum: MovemntType, nullable: false })
  name!: MovemntType

  @Column()
  description!: string

  @Column()
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
}
