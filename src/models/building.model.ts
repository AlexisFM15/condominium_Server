import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { Apartment } from './apartment.model.js'

@Entity()
export class Building {
  @PrimaryGeneratedColumn('identity')
  id!: number

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

  @OneToMany(() => Apartment, (apartment) => apartment.building)
  apartment!: Apartment[]
}
