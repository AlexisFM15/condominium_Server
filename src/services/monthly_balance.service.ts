import database from '../config/database.js'
import { Montlhy_balance } from '../models/monthly_balance.model.js'

export const monthly_balanceService = database.appDataSource
  .getRepository(Montlhy_balance)
  .extend({
    findLast() {
      return this.createQueryBuilder('Montlhy_balance')
        .orderBy('fecha_registro', 'DESC')
        .getOne()
    },
  })
