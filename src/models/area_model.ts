import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm'
import { Schedule_area } from './schedule_area.model.js'

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id!: string

  @Index({ unique: true })
  @Column()
  name!: string

  @Column()
  description!: string

  //timestamps

  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations

  @OneToMany(() => Schedule_area, (schedule_area) => schedule_area.area)
  schedule_area!: Schedule_area[]
}
