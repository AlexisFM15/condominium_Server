import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

@Entity()
export class Montlhy_balance {
  @PrimaryGeneratedColumn()
  id!: string

  @Column()
  income!: number

  @Column()
  expense!: number

  @Column()
  year!: Date

  @Column()
  month!: Date

  @Column()
  total!: number

  //timestamps
  @CreateDateColumn()
  fecha_registro!: Date

  @UpdateDateColumn()
  fecha_actualizacion!: Date

  @DeleteDateColumn()
  fecha_eliminado!: Date

  //relations
}
