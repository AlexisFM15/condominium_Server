import { z } from 'zod'
import { MovemntType } from '../utils/enums.js'

export const createMovementSchema = z.object({
  name: z.enum(MovemntType),
  description: z.string().min(1),
  amount: z.number(),
  date: z.coerce.date(),
  monthlyBalanceId: z.coerce.number().int().positive(),
})

export const updateMovementSchema = z.object({
  name: z.enum(MovemntType).optional(),
  description: z.string().min(1).optional(),
  amount: z.number().optional(),
  date: z.coerce.date().optional(),
  monthlyBalanceId: z.coerce.number().int().positive().optional(),
})

export const movementParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
