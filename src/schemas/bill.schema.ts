import { z } from 'zod'
import { BillStatus } from '../utils/enums.js'

const statusValues = Object.values(BillStatus) as [string, ...string[]]

export const createBillSchema = z.object({
  amount: z.number().positive(),
  status: z.enum(statusValues).optional(),
  due_date: z.coerce.date(),
  year: z.string().min(1),
  month: z.string().min(1),
  gas_pic: z.string().min(1),
  apartmentId: z.coerce.number().int().positive(),
})

export const updateBillSchema = z.object({
  amount: z.number().positive().optional(),
  status: z.enum(statusValues).optional(),
  due_date: z.coerce.date().optional(),
  year: z.string().min(1).optional(),
  month: z.string().min(1).optional(),
  gas_pic: z.string().min(1).optional(),
  apartmentId: z.coerce.number().int().positive().optional(),
})

export const billParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
