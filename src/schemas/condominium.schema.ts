import { z } from 'zod'

// Create schema
export const createCondominiumSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
})

// Update (parcial)
export const updateCondominiumSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
})

// Params (id)
export const condominiumParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

// Types
export type CreateCondominiumInput = z.infer<typeof createCondominiumSchema>
export type UpdateCondominiumInput = z.infer<typeof updateCondominiumSchema>
