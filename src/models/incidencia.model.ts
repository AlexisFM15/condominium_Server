import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { Condominium } from './condominium.model.js'
import { User } from './user.model.js'

export enum IncidenciaEstado {
  ABIERTA = 'abierta',
  EN_PROCESO = 'en_proceso',
  RESUELTA = 'resuelta',
}

@Entity()
export class Incidencia {
  @PrimaryGeneratedColumn('identity')
  id!: number

  @Column({ type: 'varchar' })
  title!: string

  @Column({ type: 'text' })
  description!: string

  @Column({
    type: 'enum',
    enum: IncidenciaEstado,
    default: IncidenciaEstado.ABIERTA,
  })
  status!: IncidenciaEstado

  //timestamps
  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
  @ManyToOne(() => Condominium)
  condominium!: Condominium

  @ManyToOne(() => User)
  reportedBy!: User
}