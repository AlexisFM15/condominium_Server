import database from '../config/database.js'
import { Vote } from '../models/vote.model.js'

export const voteService = database.appDataSource.getRepository(Vote)
