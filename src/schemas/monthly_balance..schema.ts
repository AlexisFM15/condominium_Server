import { z } from 'zod'

export const createMonthlyBalanceSchema = z.object({
  income: z.number().positive(),
  expense: z.number().positive(),
  year: z.string().min(1, 'year is required'),
  month: z.string().min(1, 'Month is required'),
  total: z.number(),
})

export const updateMonthlyBalanceSchema = z.object({
  income: z.number().optional(),
  expense: z.number().optional(),
  year: z.string().min(1),
  month: z.string().min(1),
  total: z.number().optional(),
})

export const monthlyBalanceParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
