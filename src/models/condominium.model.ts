import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { Building } from './building.model.js'
import { Area } from './area.model.js'

@Entity()
export class Condominium {
  @PrimaryGeneratedColumn('identity')
  id!: number

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'text' })
  description!: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  latefee_amount!: number

  @Column({ type: 'int', default: 0 })
  time_limit_days!: number

  @Column({ type: 'int', default: 1 })
  invoicesDate!: number

  //timestamps
  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations

  @OneToMany(() => Building, (building) => building.condominium)
  building!: Building[]

  @OneToMany(() => Area, (area) => area.condominium)
  area!: Area[]
}
