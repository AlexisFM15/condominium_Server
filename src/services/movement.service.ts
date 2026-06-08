import database from '../config/database.js'
import { Movement } from '../models/movement.model.js'

export const movementService = database.appDataSource
  .getRepository(Movement)
  .extend({
    findByMonthlyBalance(id: number) {
      return this.createQueryBuilder('m').where('m.Monthly', { id: id })
    },
  })
