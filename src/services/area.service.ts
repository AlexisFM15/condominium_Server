import database from '../config/database.js'
import { Area } from '../models/area.model.js'

export const areaService = database.appDataSource.getRepository(Area)
