import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm'
import { User } from './user.model.js'
import { Poll } from './poll.model.js'
import { VoteType } from '../utils/enums.js'

@Entity()
@Unique(['user', 'poll'])
export class Vote {
  @PrimaryGeneratedColumn('identity')
  id!: number

  @Column({
    type: 'enum',
    enum: VoteType,
  })
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
