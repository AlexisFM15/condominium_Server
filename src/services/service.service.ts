import database from '../config/database.js'
import { Service } from '../models/service.model.js'

export const serviceService = database.appDataSource.getRepository(Service)
