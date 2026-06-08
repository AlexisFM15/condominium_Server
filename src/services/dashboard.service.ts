import database from '../config/database.js'
import { Bill } from '../models/bill.model.js'
import { Schedule_area } from '../models/schedule_area.model.js'
import { User } from '../models/user.model.js'

export const getDashboard = async (userId: string) => {
  const user = await database.appDataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.apartment', 'apartment')
    .leftJoinAndSelect('apartment.building', 'building')
    .where('user.id = :userId', { userId })
    .getOne()

  const bills = await database.appDataSource
    .getRepository(Bill)
    .createQueryBuilder('bill')
    .leftJoinAndSelect('bill.apartment', 'apartment')
    .where('apartment.id = :apartmentId', {
      apartmentId: user?.apartment?.id,
    })
    // .where('bill.apartmet = :userId', {
    //   userId,
    // })
    .orderBy('bill.fecha_registro', 'DESC')
    .limit(12)
    .getMany()

  const reservations = await database.appDataSource
    .getRepository(Schedule_area)
    .createQueryBuilder('sa')
    .where('sa.userId = :userId', {
      userId: userId,
    })
    .leftJoinAndSelect('sa.area', 'area')
    .leftJoinAndSelect('sa.user', 'user')
    .orderBy('sa.reservation_date', 'DESC')
    .getMany()

  return {
    user,
    apartment: user?.apartment,
    building: user?.apartment?.building,
    bills,
    reservations
  }
}
