import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { User } from './user.model.js'

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id!: string

  @Column({ type: 'varchar' })
  token!: string

  @Column({ type: 'varchar' })
  ip!: string

  @Column({ type: 'varchar' })
  device!: string

  //timestamps

  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
  @ManyToOne(() => User, (user) => user.session)
  user!: User
}
