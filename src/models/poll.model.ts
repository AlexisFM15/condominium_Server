import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { User } from './user.model.js'
import { Vote } from './vote.model.js'
import { PollStatus } from '../utils/enums.js'

@Entity()
export class Poll {
  @PrimaryGeneratedColumn('identity')
  id!: number

  @Column({ type: 'text' })
  description!: string

  @Column({ type: 'int', nullable: true })
  poll_result!: number

  @Column({ type: 'date' })
  expires_at!: Date

  @Column({ type: 'enum', enum: PollStatus, default: PollStatus.CLOSE })
  status!: string

  @Column({ type: 'int',default: 0 })
votesFor!: number

@Column({ type: 'int', default: 0 })
votesAgainst!: number

  //timestamps

  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations

  @ManyToOne(() => User, (user) => user.poll)
  user!: User

  @OneToMany(() => Vote, (vote) => vote.user)
  vote!: Vote[]
}
