import { z } from 'zod'

export const createBuildingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1).optional(),
  serviceCost: z.number().positive(),
  condominiumId: z.coerce.number().int().positive(),
})

export const updateBuildingSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  serviceCost: z.number().positive(),
  condominiumId: z.coerce.number().int().positive().optional(),
})

export const buildingParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
