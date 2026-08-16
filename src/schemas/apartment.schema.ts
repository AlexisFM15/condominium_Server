import { z } from 'zod'

import { occupancyType } from '../utils/enums.js'

export const createApartmentSchema = z.object({
  number: z.coerce.number().int().positive(),
  occupancyType: z.enum(occupancyType).optional(),
  rent: z.coerce.number().positive().optional(),
  lastGasMetric: z.number().positive().optional(),
  buildingId: z.number().int().positive(),
  serviceCost: z.coerce.number().positive(),
  userId: z.uuid().optional(),
})

export const updateApartmentSchema = z.object({
  number: z.coerce.number().int().positive().optional(),
  occupancyType: z.enum(occupancyType).optional(),
  rent: z.coerce.number().positive().optional(),
  lastGasMetric: z.coerce.number().positive().optional(),
  serviceCost: z.coerce.number().positive().optional(),
  buildingId: z.number().int().positive().optional(),
  userId: z.uuid().optional(),
})

export const apartmentParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})
