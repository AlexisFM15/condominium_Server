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

@Entity()
export class Poll {
  @PrimaryGeneratedColumn('identity')
  id!: number

  @Column()
  description!: string

  @Column({ type: 'date' })
  expires_at!: Date

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
