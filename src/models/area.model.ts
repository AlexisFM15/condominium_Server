import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
  ManyToOne,
} from 'typeorm'
import { Schedule_area } from './schedule_area.model.js'
import { Condominium } from './condominium.model.js'

@Entity()
export class Area {
  @PrimaryGeneratedColumn('identity')
  id!: number

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'text' })
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

  @ManyToOne(() => Condominium, (condominium) => condominium.building)
  condominium!: Condominium
}
