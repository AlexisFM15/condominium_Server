import database from '../config/database.js'
import { Bill } from '../models/bill.model.js'
import { BillStatus, occupancyType } from '../utils/enums.js'

export const billService = database.appDataSource.getRepository(Bill).extend({
  findLast() {
    return this.createQueryBuilder('Bill')
      .orderBy('fecha_registro', 'DESC')
      .getOne()
  },
  findByPendingStatus() {
    // reminder: optimize this query to exclude not necessary fields to make it faster
    return this.createQueryBuilder('Bill')
      .where('Bill.status = :status', { status: BillStatus.PENDING })
      .andWhere('Apartment.occupancyType != :type', {
        type: occupancyType.VACANT, // latefee not apply for vacants aparments
      })
      .leftJoinAndSelect('Bill.apartment', 'Apartment')
      .leftJoinAndSelect('Apartment.user', 'User')
      .leftJoinAndSelect('Apartment.building', 'Building')
      .leftJoinAndSelect('Building.condominium', 'Condominium')
      .getMany()
  },
  findOneByPendingStatus(id: number) {
    return this.createQueryBuilder('Bill')
      .where('Bill.status = :status', { status: BillStatus.PENDING })
      .andWhere('Bill.id = :id', { id: id })
      .getOne()
  },
  findOneByPendingStatusValidation() {
    return this.createQueryBuilder('Bill')
      .where('Bill.status = :status', { status: BillStatus.PENDING })
      .getOne()
  },
})
