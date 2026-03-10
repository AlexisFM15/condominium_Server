import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm'
import { Rol } from '../utils/enums.js'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ nullable: false })
  name!: string

  @Column({ nullable: false })
  lastname!: string

  @Index({ unique: true })
  @Column({ nullable: false })
  phone!: string

  @Index({ unique: true })
  @Column({ nullable: false })
  email!: string

  @Column({ nullable: false })
  password!: string

  @Column({ type: 'enum', enum: Rol, default: [Rol.CONDOMINIUM] })
  role!: Rol

  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date
}
