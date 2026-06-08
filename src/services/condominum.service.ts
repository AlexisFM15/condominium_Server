import database from '../config/database.js'
import { Condominium } from '../models/condominium.model.js'

export const condominiumService =
  database.appDataSource.getRepository(Condominium)
