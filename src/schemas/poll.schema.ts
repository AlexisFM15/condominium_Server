import { z } from 'zod'
import { PollStatus } from '../utils/enums.js'

export const createPollSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  expires_at: z.coerce.date(),
  votesFor: z.number(),
  votesAgainst:z.number(),
  status: z.enum(PollStatus).optional(),
  userId: z.uuid(),
})

export const updatePollSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  expires_at: z.coerce.date().optional(),
  votesFor: z.number().optional(),
  votesAgainst:z.number().optional(),
  userId: z.uuid().optional(),
})

export const pollParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
