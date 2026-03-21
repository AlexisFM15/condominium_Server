import { z } from 'zod'

import { occupancyType } from '../utils/enums.js'

export const createApartmentSchema = z.object({
  number: z.number().int().positive(),
  occupancyType: z.enum(occupancyType).optional(),
  rent: z.number().positive().optional(),
  lastGasMetric: z.number().positive().optional(),
  buildingId: z.number().int().positive(),
  userId: z.uuid().optional(),
})

export const updateApartmentSchema = z.object({
  number: z.number().int().positive().optional(),
  occupancyType: z.enum(occupancyType).optional(),
  rent: z.number().positive().optional(),
  lastGasMetric: z.number().positive().optional(),
  buildingId: z.number().int().positive().optional(),
  userId: z.uuid().optional(),
})

export const apartmentParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
