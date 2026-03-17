import { z } from 'zod'

export const createMonthlyBalanceSchema = z.object({
  income: z.number(),
  expense: z.number(),
  year: z.coerce.date().min(1, 'year is required'),
  month: z.coerce.date().min(1, 'Month is required'),
  total: z.number(),
})

export const updateMonthlyBalanceSchema = z.object({
  income: z.number().optional(),
  expense: z.number().optional(),
  year: z.coerce.date().optional(),
  month: z.coerce.date().optional(),
  total: z.number().optional(),
})

export const monthlyBalanceParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
