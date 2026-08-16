import database from '../config/database.js'
import { Apartment } from '../models/apartment.model.js'
import { occupancyType } from '../utils/enums.js'

export const apartmentService = database.appDataSource
  .getRepository(Apartment)
  .extend({
    findForBills() {
      return this.createQueryBuilder('Apartment')
        .where('Apartment.occupancyType != :type', {
          type: occupancyType.VACANT,
        })
        .leftJoinAndSelect('Apartment.building', 'Building')
        .leftJoinAndSelect('Building.condominium', 'Condominium')
        .leftJoinAndSelect('Apartment.user', 'User')
        .getMany()
    },
    findForSendBill(id: number) {
      return this.createQueryBuilder('Apartment')
        .where('Apartment.id = :id', {
          id: id,
        })
        .leftJoinAndSelect('Apartment.building', 'Building')
        .leftJoinAndSelect('Apartment.user', 'User')

        .leftJoinAndSelect('Building.condominium', 'Condominium')
        .getOne()
    },
  })
