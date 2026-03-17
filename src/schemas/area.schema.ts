import { z } from 'zod'

export const createAreaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

export const updateAreaSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
})

export const areaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
