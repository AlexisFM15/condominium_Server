import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm'

@Entity()
export class Service {
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
}
