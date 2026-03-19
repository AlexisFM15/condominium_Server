import database from '../config/database.js'
import { Apartment } from '../models/apartment.model.js'

export const apartmentService = database.appDataSource.getRepository(Apartment)
