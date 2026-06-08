import database from '../config/database.js'
import { Schedule_area } from '../models/schedule_area.model.js'

export const schedule_areaService = database.appDataSource
  .getRepository(Schedule_area)
  .extend({
    findByDateAndArea(area: number, reservation_date: Date) {
      return this.createQueryBuilder('sa')
        .where('sa.reservation_date = :reservation_date', {
          reservation_date: reservation_date,
        })
        .andWhere('sa.areaId = :area', { area: area })
        .getOne()
    },
  })
