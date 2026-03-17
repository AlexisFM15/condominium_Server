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

@Entity()
export class Condominium {
  @PrimaryGeneratedColumn('identity')
  id!: number

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

  @OneToMany(() => Building, (building) => building.condominium)
  building!: Building[]
}
