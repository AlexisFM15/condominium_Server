import database from '../config/database.js'
import { Incidencia } from '../models/incidencia.model.js'

export const incidenciaService = database.appDataSource.getRepository(Incidencia)