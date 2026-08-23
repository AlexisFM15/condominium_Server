import { z } from 'zod'

// Create schema
export const createCondominiumSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  latefee_amount: z.number().optional(),
  time_limit_days: z.number().optional(),
  invoicesDate: z.number().optional(),
  promo: z.number().optional(),
})

// Update (parcial)
export const updateCondominiumSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  latefee_amount: z.coerce.number().optional(),
  time_limit_days: z.coerce.number().optional(),
  invoicesDate: z.coerce.number().optional(),
  promo: z.coerce.number().optional(),
})

// Params (id)
export const condominiumParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

// Types
export type CreateCondominiumInput = z.infer<typeof createCondominiumSchema>
export type UpdateCondominiumInput = z.infer<typeof updateCondominiumSchema>
