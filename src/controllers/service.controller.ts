import { Context } from 'koa'
import {
  createServiceSchema,
  updateServiceSchema,
  serviceParamsSchema,
} from '../schemas/service.schema.js'
import { serviceService } from '../services/service.service.js'
import { Service } from '../models/service.model.js'

// CREATE
export const createService = async (ctx: Context) => {
  const result = createServiceSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const service = serviceService.create(result.data)
    await serviceService.save(service)

    ctx.status = 201
    ctx.body = service
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getServices = async (ctx: Context) => {
  try {
    const services = await serviceService.find({
      relations: [''],
    })

    ctx.body = services
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getServiceById = async (ctx: Context) => {
  const params = serviceParamsSchema.parse(ctx.params)

  try {
    const service = await serviceService.findOne({
      where: { id: params.id },
      relations: [''],
    })

    if (!service) {
      ctx.throw(404, 'service not found')
    }

    ctx.body = service
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updateService = async (ctx: Context) => {
  const params = serviceParamsSchema.parse(ctx.params)

  try {
    const result = updateServiceSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const service = await serviceService.findOne({
      where: { id: params.id },
    })

    if (!service) {
      ctx.throw(404, 'service not found')
    }

    serviceService.merge(service, result.data as Partial<Service>)
    await serviceService.save(service)

    ctx.body = service
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteService = async (ctx: Context) => {
  const params = serviceParamsSchema.parse(ctx.params)

  try {
    const service = await serviceService.findOne({
      where: { id: params.id },
    })

    if (!service) {
      ctx.throw(404, 'service not found')
    }

    await serviceService.softRemove(service)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}
