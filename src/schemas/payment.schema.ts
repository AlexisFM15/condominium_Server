import { z } from 'zod'
import { Payment_Method } from '../utils/enums.js'

export const createPaymentSchema = z.object({
  description: z.string().min(1),
  amount: z.number(),
  payment_method: z.enum(Payment_Method),
  payment_date: z.coerce.date(),
})

export const updatePaymentSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().optional(),
  payment_method: z.enum(Payment_Method).optional(),
  payment_date: z.coerce.date().optional(),
})

export const paymentParamsSchema = z.object({
  id: z.uuid(),
})
