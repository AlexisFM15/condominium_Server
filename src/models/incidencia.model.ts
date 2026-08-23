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
  Pending = 'Pendiente',
  Open = 'En proceso',
  Resolved = 'Resuelta',
}

export enum IncidenciaPrioridad {
  BAJA = 'Baja',
  MEDIA = 'Media',
  ALTA = 'Alta',
  NODEFINIDA = 'Sin Definir'
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
    default: IncidenciaEstado.Pending,
  })
  status!: IncidenciaEstado

  @Column({
  type: 'enum',
  enum: IncidenciaPrioridad,
  default: IncidenciaPrioridad.NODEFINIDA,
})
priority!: IncidenciaPrioridad

@Column({
  type: 'date',
  nullable: true,
})
commitment_date!: Date | null

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