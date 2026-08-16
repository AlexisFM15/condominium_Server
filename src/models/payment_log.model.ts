import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

@Entity()
export class Payment_log {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  note!: string

  //timestamps
  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
}
