import { z } from 'zod'
import { BillStatus, MovemntType } from '../utils/enums.js'

export const createBillSchema = z.object({
  amount: z.number().positive(),
  status: z.enum(BillStatus).optional(),
  due_date: z.coerce.date(),
  year: z.string().min(1),
  month: z.string().min(1),
  gas_pic: z.string().min(1),
  apartmentId: z.coerce.number().int().positive(),
  gas_metric: z.number().positive(),
  latefee: z.number().positive(),
  lateFeeStatus: z.boolean(),
})

export const updateBillSchema = z.object({
  amount: z.number().positive().optional(),
  status: z.enum(BillStatus).optional(),
  due_date: z.coerce.date().optional(),
  year: z.string().min(1).optional(),
  month: z.string().min(1).optional(),
  gas_pic: z.string().min(1).optional(),
  apartmentId: z.coerce.number().int().positive().optional(),
  gas_metric: z.number().positive(),
  latefee: z.number().positive(),
  lateFeeStatus: z.boolean(),
})

export const sendBillSchema = z.object({
  status: z.enum(BillStatus).optional(),
  gas_pic: z.string().min(1).optional(),
  gasMetric: z.number().positive(),
})

export const payBills = z.object({
  type_movement: z.enum(MovemntType),
  
})

export const billParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
