import { z } from 'zod'

import {
  IncidenciaEstado,
  IncidenciaPrioridad,
} from '../models/incidencia.model.js'

export const createIncidenciaSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),

  description: z.string().min(1, 'La descripción es requerida'),

  condominiumId: z.coerce.number().int().positive(),

  priority: z.enum(IncidenciaPrioridad).optional(),

  commitment_date: z.coerce.date().nullable().optional(),
})

export const updateIncidenciaSchema = z.object({
  title: z.string().min(1).optional(),

  description: z.string().min(1).optional(),

  status: z.enum(IncidenciaEstado).optional(),

  priority: z.enum(IncidenciaPrioridad).optional(),

  commitment_date: z.coerce.date().nullable().optional(),
})

export const incidenciaParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
})