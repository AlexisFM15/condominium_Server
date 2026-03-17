import database from '../config/database.js'
import { Payment } from '../models/payment.model.js'

export const paymentService = database.appDataSource.getRepository(Payment)
