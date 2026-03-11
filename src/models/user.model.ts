import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm'
import { Rol } from '../utils/enums.js'
import { Poll } from './poll.model.js'
import { Apartment } from './apartment.model.js'
import { Vote } from './vote.model.js'
import { Schedule_area } from './schedule_area.model.js'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ nullable: false, type: 'varchar' })
  name!: string

  @Column({ nullable: false, type: 'varchar' })
  lastname!: string

  @Index({ unique: true })
  @Column({ nullable: false, type: 'varchar' })
  phone!: string

  @Index({ unique: true })
  @Column({ nullable: false, type: 'varchar' })
  email!: string

  @Column({ nullable: false, type: 'varchar' })
  password!: string

  @Column({ type: 'enum', enum: Rol, default: [Rol.CONDOMINIUM] })
  role!: Rol

  //timestamps

  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations

  @OneToMany(() => Poll, (poll) => poll.user)
  poll!: Poll[]

  @OneToOne(() => Apartment, (apartment) => apartment.user)
  apartment!: Apartment

  @OneToMany(() => Schedule_area, (schedule_area) => schedule_area.user)
  schedule_area!: Schedule_area[]

  @OneToMany(() => Vote, (vote) => vote.user)
  vote!: Vote[]
}
