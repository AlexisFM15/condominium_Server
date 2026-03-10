import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm'
import { StatusSchedule } from '../utils/enums.js'

@Entity()
export class Schedule_area {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'date' })
  reservation_date!: Date

  @Column({ type: 'time' })
  start_time!: string

  @Column({ type: 'time' })
  end_time!: string

  @Column({
    type: 'enum',
    enum: StatusSchedule,
    default: [StatusSchedule.PENDING],
  })
  status!: StatusSchedule

  //timestamps
  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
}
