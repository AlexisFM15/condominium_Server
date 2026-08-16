import { Context } from 'koa'
import {
  createMovementSchema,
  updateMovementSchema,
  movementParamsSchema,
} from '../schemas/movement.schema.js'
import { movementService } from '../services/movement.service.js'
import { Movement } from '../models/movement.model.js'

// CREATE
export const createMovement = async (ctx: Context) => {
  const result = createMovementSchema.safeParse(ctx.request.body)

  console.log(result.data)
  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }
    const movement = movementService.create({
  type: result.data.type,
  description: result.data.description,
  amount: result.data.amount,
  date: result.data.date,
  monthly_balance: result.data.monthlyBalanceId
})

await movementService.save(movement)
    ctx.status = 201
    ctx.body = movement
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getMovements = async (ctx: Context) => {
  try {
    const movements = await movementService.find({
      relations: ['monthly_balance'],
    })

    ctx.body = movements
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getMovementById = async (ctx: Context) => {
  const params = movementParamsSchema.parse(ctx.params)

  try {
    const movement = await movementService.findOne({
      where: { id: params.id },
      relations: ['monthly_balance'],
    })

    if (!movement) {
      ctx.throw(404, 'movement not found')
    }

    ctx.body = movement
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updateMovement = async (ctx: Context) => {
  const params = movementParamsSchema.parse(ctx.params)

  try {
    const result = updateMovementSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const movement = await movementService.findOne({
      where: { id: params.id },
    })

    if (!movement) {
      ctx.throw(404, 'movement not found')
    }

    movementService.merge(movement, result.data as Partial<Movement>)
    await movementService.save(movement)

    ctx.body = movement
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteMovement = async (ctx: Context) => {
  const params = movementParamsSchema.parse(ctx.params)

  try {
    const movement = await movementService.findOne({
      where: { id: params.id },
    })

    if (!movement) {
      ctx.throw(404, 'movement not found')
    }

    await movementService.softRemove(movement)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}
