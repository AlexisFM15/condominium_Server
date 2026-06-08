import { z } from 'zod'

export const createVoteSchema = z.object({
  vote: z.string().min(1),
  userId: z.uuid(),
  pollId: z.coerce.number().int().positive(),
})

export const updateVoteSchema = z.object({
  vote: z.string().min(1).optional(),
  userId: z.uuid().optional(),
  pollId: z.coerce.number().int().positive().optional(),
})

export const voteParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
