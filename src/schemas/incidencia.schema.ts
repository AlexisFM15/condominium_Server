import { z } from 'zod'
import { IncidenciaEstado } from '../models/incidencia.model.js'

export const createIncidenciaSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  condominiumId: z.coerce.number().int().positive(),
})

export const updateIncidenciaSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.nativeEnum(IncidenciaEstado).optional(),
})

export const incidenciaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})