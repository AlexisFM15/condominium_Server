import { Context } from 'koa'
import {
  createCondominiumSchema,
  updateCondominiumSchema,
  condominiumParamsSchema,
} from '../schemas/condominium.schema.js'
import { condominiumService } from '../services/condominum.service.js'
import { Condominium } from '../models/condominium.model.js'

// CREATE
export const createCondominium = async (ctx: Context) => {
  const result = createCondominiumSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const condominium = condominiumService.create(result.data)
    await condominiumService.save(condominium)

    ctx.status = 201
    ctx.body = condominium
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getCondominiums = async (ctx: Context) => {
  try {
    const condominiums = await condominiumService.find()

    ctx.status = 200
    ctx.body = condominiums
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getCondominiumById = async (ctx: Context) => {
  const params = condominiumParamsSchema.parse(ctx.params)

  try {
    const condominium = await condominiumService.findOne({
      where: { id: params.id },
      relations: ['building'],
    })

    if (!condominium) {
      ctx.throw(404, 'Condominium not found')
    }

    ctx.body = condominium
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updateCondominium = async (ctx: Context) => {
  const params = condominiumParamsSchema.parse(ctx.params)

  try {
    const result = updateCondominiumSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const condominium = await condominiumService.findOne({
      where: { id: params.id },
    })

    if (!condominium) {
      ctx.throw(404, 'Condominium not found')
    }

    condominiumService.merge(condominium, result.data as Partial<Condominium>)
    await condominiumService.save(condominium)

    ctx.body = condominium
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteCondominium = async (ctx: Context) => {
  const params = condominiumParamsSchema.parse(ctx.params)

  try {
    const condominium = await condominiumService.findOne({
      where: { id: params.id },
    })

    if (!condominium) {
      ctx.throw(404, 'Condominium not found')
    }

    await condominiumService.softRemove(condominium)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}
