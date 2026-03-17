import { z } from 'zod'

export const createPollSchema = z.object({
  description: z.string().min(1),
  expires_at: z.coerce.date(),
  userId: z.uuid(),
})

export const updatePollSchema = z.object({
  description: z.string().min(1).optional(),
  expires_at: z.coerce.date().optional(),
  userId: z.uuid().optional(),
})

export const pollParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
