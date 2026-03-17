import database from '../config/database.js'
import { Movement } from '../models/movement.model.js'

export const movementService = database.appDataSource.getRepository(Movement)
