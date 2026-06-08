import { z } from 'zod'
import { PollStatus } from '../utils/enums.js'

export const createPollSchema = z.object({
  description: z.string().min(1),
  expires_at: z.coerce.date(),
  poll_result: z.number(),
  status: z.enum(PollStatus).optional(),
  userId: z.uuid(),
})

export const updatePollSchema = z.object({
  description: z.string().min(1).optional(),
  expires_at: z.coerce.date().optional(),
  poll_result: z.number(),
  userId: z.uuid().optional(),
})

export const pollParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
