import { z } from 'zod'

export const createAreaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'description is required'),
  condominiumId: z.coerce.number().int().positive(),
})

export const updateAreaSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  condominiumId: z.coerce.number().int().positive().optional(),
})

export const areaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
