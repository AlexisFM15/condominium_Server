import { Context } from 'koa'
import {
  createScheduleAreaSchema,
  updateScheduleAreaSchema,
  scheduleAreaParamsSchema,
} from '../schemas/schedule_area.schema.js'
import { schedule_areaService } from '../services/schedule_area.service.js'
import { Schedule_area } from '../models/schedule_area.model.js'
import { StatusSchedule } from '../utils/enums.js'

// CREATE
export const createsShedule_area = async (ctx: Context) => {
  const result = createScheduleAreaSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const schedule_area = schedule_areaService.create({
      reservation_date: result.data.reservation_date,
      start_time: result.data.start_time,
      end_time: result.data.end_time,
      status: result.data.status ?? StatusSchedule.PENDING,
      area: { id: result.data.areaId },
      user: { id: result.data.userId },
    })
    await schedule_areaService.save(schedule_area)

    ctx.status = 201
    ctx.body = schedule_area
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getSchedule_areas = async (ctx: Context) => {
  try {
    const schedule_areas = await schedule_areaService.find({
      relations: ['area', 'user'],
    })

    ctx.body = schedule_areas
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getSchedule_areaById = async (ctx: Context) => {
  const params = scheduleAreaParamsSchema.parse(ctx.params)

  try {
    const schedule_area = await schedule_areaService.findOne({
      where: { id: params.id },
      relations: ['building'],
    })

    if (!schedule_area) {
      ctx.throw(404, 'schedule_area not found')
    }

    ctx.body = schedule_area
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updateSchedule_area = async (ctx: Context) => {
  const params = scheduleAreaParamsSchema.parse(ctx.params)

  try {
    const result = updateScheduleAreaSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const schedule_area = await schedule_areaService.findOne({
      where: { id: params.id },
    })

    if (!schedule_area) {
      ctx.throw(404, 'schedule_area not found')
    }

    schedule_areaService.merge(
      schedule_area,
      result.data as Partial<Schedule_area>,
    )
    await schedule_areaService.save(schedule_area)

    ctx.body = schedule_area
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteSchedule_area = async (ctx: Context) => {
  const params = scheduleAreaParamsSchema.parse(ctx.params)

  try {
    const schedule_area = await schedule_areaService.findOne({
      where: { id: params.id },
    })

    if (!schedule_area) {
      ctx.throw(404, 'schedule_area not found')
    }

    await schedule_areaService.softRemove(schedule_area)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}
