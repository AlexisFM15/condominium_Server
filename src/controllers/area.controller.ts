import { Context } from 'koa'
import {
  createAreaSchema,
  updateAreaSchema,
  areaParamsSchema,
} from '../schemas/area.schema.js'
import { areaService } from '../services/area.service.js'
import { Area } from '../models/area.model.js'
import { Condominium } from '../models/condominium.model.js'

// CREATE
export const createArea = async (ctx: Context) => {
  const result = createAreaSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const area = areaService.create({
      name:result.data.name,
      description: result.data.description,
      condominium : {id: result.data.condominiumId} ,
    })
    await areaService.save(area)

    ctx.status = 201
    ctx.body = area
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getAreas = async (ctx: Context) => {
  try {
    const areas = await areaService.find({
      relations: ['condominium'],
    })
    ctx.body = areas
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getAreaById = async (ctx: Context) => {
  const params = areaParamsSchema.parse(ctx.params)

  try {
    const area = await areaService.findOne({
      where: { id: params.id },
      relations: [''],
    })

    if (!area) {
      ctx.throw(404, 'area not found')
    }

    ctx.body = area
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updateArea = async (ctx: Context) => {
  const params = areaParamsSchema.parse(ctx.params)

  try {
    const result = updateAreaSchema.safeParse(ctx.request.body)
    console.log(result)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const area = await areaService.findOne({
  where: { id: params.id },
  relations: ['condominium'],
})

if (!area) {
  ctx.throw(404, 'area not found')
}

areaService.merge(area, {
  name: result.data.name,
  description: result.data.description,
})

if (result.data.condominiumId) {
  area.condominium = {
    id: result.data.condominiumId,
  } as Condominium
}
await areaService.save(area)
    ctx.body = area
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteArea = async (ctx: Context) => {
  const params = areaParamsSchema.parse(ctx.params)

  try {
    const area = await areaService.findOne({
      where: { id: params.id },
    })

    if (!area) {
      ctx.throw(404, 'area not found')
    }

    await areaService.softRemove(area)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}
