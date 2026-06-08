import database from '../config/database.js'
import { Building } from '../models/building.model.js'

export const buildingService = database.appDataSource.getRepository(Building)
