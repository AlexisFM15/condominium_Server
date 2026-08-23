import { z } from 'zod'
import { Rol } from '../utils/enums.js'

export const createUserSchema = z.object({
  name: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
  role: z.enum(Rol).optional(),
  balance: z.number().positive(),
  defaultPassword: z.boolean().optional(),

  // relaciones
  apartmentId: z.coerce.number().int().optional(),

})

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.email().optional(),
  balance: z.coerce.number().positive().optional(),  
  defaultPassword: z.boolean().optional(),
  role: z.enum(Rol).optional(),

  // relaciones
  apartmentId: z.coerce.number().int().optional(),
  // condominiumId: z.coerce.number().int().positive().optional(),

  // flags
  // defaultPassword: z.boolean().optional(),
})

export const userParamsSchema = z.object({
  id: z.uuid(),
})
