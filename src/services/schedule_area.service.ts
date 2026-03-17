import database from '../config/database.js'
import { Schedule_area } from '../models/schedule_area.model.js'

export const schedule_areaService =
  database.appDataSource.getRepository(Schedule_area)
