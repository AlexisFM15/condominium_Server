import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
})

export const updateServiceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
})

export const serviceParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
