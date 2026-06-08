import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm'
import { Apartment } from './apartment.model.js'
import { Condominium } from './condominium.model.js'

@Entity()
export class Building {
  @PrimaryGeneratedColumn('identity')
  id!: number

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'text', nullable: true })
  description!: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceCost!: number

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

  @ManyToOne(() => Condominium, (condominium) => condominium.building)
  condominium!: Condominium
}
