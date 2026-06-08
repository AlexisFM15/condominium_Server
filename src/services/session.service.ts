import database from '../config/database.js'
import { Session } from '../models/session.model.js'

export const sessionService = database.appDataSource.getRepository(Session)
