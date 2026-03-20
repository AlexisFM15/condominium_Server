import database from '../config/database.js'
import { Bill } from '../models/bill.model.js'

export const billService = database.appDataSource.getRepository(Bill).extend({
  findLast() {
    return this.createQueryBuilder('Bill')
      .orderBy('fecha_registro', 'DESC')
      .getOne()
  },
})
