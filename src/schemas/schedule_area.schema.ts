import { z } from 'zod'
import { StatusSchedule } from '../utils/enums.js'

export const createScheduleAreaSchema = z.object({
  reservation_date: z.coerce.date(),
  start_time: z.string().min(1), // formato HH:mm
  end_time: z.string().min(1), // formato HH:mm
  status: z.enum(StatusSchedule).optional(),
  areaId: z.coerce.number().int().positive(),
  userId: z.uuid(),
})

export const updateScheduleAreaSchema = z.object({
  reservation_date: z.coerce.date().optional(),
  start_time: z.string().min(1).optional(),
  end_time: z.string().min(1).optional(),
  status: z.enum(StatusSchedule).optional(),
  areaId: z.coerce.number().int().positive().optional(),
  userId: z.uuid().optional(),
})

export const scheduleAreaParamsSchema = z.object({
  id: z.uuid(),
})
