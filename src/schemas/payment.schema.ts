import { z } from 'zod'
import { Payment_Method, Payment_type } from '../utils/enums.js'

export const createPaymentSchema = z.object({
  description: z.string().min(1),
  amount: z.number(),
  reference: z.string().min(1),
  payment_method: z.enum(Payment_Method),
  payment_date: z.coerce.date(),
  paymentType: z.enum(Payment_type),
})

export const updatePaymentSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().optional(),
  reference: z.string().optional(),
  payment_method: z.enum(Payment_Method).optional(),
  payment_date: z.coerce.date().optional(),
  paymentType: z.enum(Payment_type).optional(),
})

export const paymentParamsSchema = z.object({
  id: z.uuid(),
})
