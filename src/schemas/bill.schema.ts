import { z } from 'zod'
import { BillStatus, MovemntType } from '../utils/enums.js'

export const createBillSchema = z.object({
  amount: z.coerce.number(),
  status: z.enum(BillStatus).optional(),
  due_date: z.coerce.date(),
  year: z.string().min(1),
  month: z.string().min(1),
  credited_amount: z.coerce.number().optional(),
  gas_pic: z.string().optional(),
  apartmentId: z.coerce.number().int().positive(),
  gas_metric: z.coerce.number(),
  gas_total: z.coerce.number(),
  latefee: z.coerce.number(),
  lateFeeStatus: z.coerce.boolean(),
})

export const updateBillSchema = z.object({
  amount: z.coerce.number().optional(),
  status: z.enum(BillStatus).optional(),
  credited_amount: z.coerce.number().optional(),
  due_date: z.coerce.date().optional(),
  year: z.string().min(1).optional(),
  month: z.string().min(1).optional(),
  apartmentId: z.coerce.number().int().positive().optional(),
  gas_metric: z.coerce.number().optional(),
  gas_total: z.coerce.number().optional(),
  latefee: z.coerce.number().optional(),
  lateFeeStatus: z
    .string()
    .transform((value) => value === 'true')
    .optional(),
})
export const sendBillSchema = z.object({
  status: z.enum(BillStatus).optional(),
  gas_pic: z.string().min(1).optional(),
  gasMetric: z.coerce.number(),
})

export const payBills = z.object({
  type_movement: z.enum(MovemntType),
  
})

export const billParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
