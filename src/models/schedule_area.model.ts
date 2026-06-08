import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { StatusSchedule } from '../utils/enums.js'
import { Area } from './area.model.js'
import { User } from './user.model.js'

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

  @ManyToOne(() => Area, (area) => area.schedule_area)
  area!: Area

  @ManyToOne(() => User, (user) => user.schedule_area)
  user!: User
}
