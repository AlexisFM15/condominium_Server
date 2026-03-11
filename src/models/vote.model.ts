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
import { Poll } from './poll.model.js'

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id!: string

  @Column({ type: 'varchar' })
  vote!: string

  //timestamps
  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
  @ManyToOne(() => User, (user) => user.vote)
  user!: User

  @ManyToOne(() => Poll, (poll) => poll.vote)
  poll!: Poll
}
