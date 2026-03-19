import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { occupancyType } from '../utils/enums.js'
import { Building } from './building.model.js'
import { User } from './user.model.js'
import { Bill } from './bill.model.js'

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn('identity')
  id!: number

  @Column({ type: 'int' })
  number!: number

  @Column({
    type: 'enum',
    enum: occupancyType,
    default: [occupancyType.VACANT],
  })
  occupancyType!: occupancyType

  //timestamps

  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
  @OneToMany(() => Bill, (bill) => bill.apartment)
  bill!: Bill[]

  @ManyToOne(() => Building, (building) => building.apartment)
  building!: Building

  @OneToOne(() => User, (user) => user.apartment)
  @JoinColumn()
  user!: User
}
