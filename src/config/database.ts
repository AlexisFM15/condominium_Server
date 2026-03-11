import { DataSource } from 'typeorm'
import { Apartment } from '../models/apartment.model.js'
import { Area } from '../models/area_model.js'
import { Bill } from '../models/bill.model.js'
import { Building } from '../models/building.model.js'
import { Montlhy_balance } from '../models/monthly_balance.model.js'
import { Movement } from '../models/movement.model.js'
import { Payment } from '../models/payment.model.js'
import { Poll } from '../models/poll.model.js'
import { Schedule_area } from '../models/schedule_area.model.js'
import { Service } from '../models/service.model.js'
import { User } from '../models/user.model.js'
import { Vote } from '../models/vote.model.js'

const appDataSource = new DataSource({
  type: 'postgres',
  database: process.env.DB_NAME!,
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  entities: [
    Apartment,
    Area,
    Bill,
    Building,
    Montlhy_balance,
    Movement,
    Payment,
    Poll,
    Schedule_area,
    Service,
    User,
    Vote,
  ],
  synchronize: true,
  migrations: ['src/migrations/*{.ts,.js}'],
})

const initializeDB = async () => {
  try {
    await appDataSource.initialize()
  } catch (error) {
    console.log('database is unavailable')
  }
}

export default { initializeDB, appDataSource }
