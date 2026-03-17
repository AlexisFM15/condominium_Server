import database from '../config/database.js'
import { Poll } from '../models/poll.model.js'

export const pollService = database.appDataSource.getRepository(Poll)
