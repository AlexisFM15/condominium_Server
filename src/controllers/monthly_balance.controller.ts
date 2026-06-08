import { Context } from 'koa'
import {
  createMonthlyBalanceSchema,
  updateMonthlyBalanceSchema,
  monthlyBalanceParamsSchema,
} from '../schemas/monthly_balance..schema.js'
import { monthly_balanceService } from '../services/monthly_balance.service.js'
import { Montlhy_balance } from '../models/monthly_balance.model.js'

// CREATE
export const createMonthly_balance = async (ctx: Context) => {
  const result = createMonthlyBalanceSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const monthly_balance = monthly_balanceService.create(result.data)
    await monthly_balanceService.save(monthly_balance)

    ctx.status = 201
    ctx.body = monthly_balance
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getMonthly_balances = async (ctx: Context) => {
  try {
    const monthly_balances = await monthly_balanceService.find()

    ctx.body = monthly_balances
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getMonthly_balanceById = async (ctx: Context) => {
  const params = monthlyBalanceParamsSchema.parse(ctx.params)

  try {
    const monthly_balance = await monthly_balanceService.findOne({
      where: { id: params.id },
      relations: [''],
    })

    if (!monthly_balance) {
      ctx.throw(404, 'monthly_balance not found')
    }

    ctx.body = monthly_balance
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updateMonthly_balance = async (ctx: Context) => {
  const params = monthlyBalanceParamsSchema.parse(ctx.params)

  try {
    const result = updateMonthlyBalanceSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const monthly_balance = await monthly_balanceService.findOne({
      where: { id: params.id },
    })

    if (!monthly_balance) {
      ctx.throw(404, 'monthly_balance not found')
    }

    monthly_balanceService.merge(
      monthly_balance,
      result.data as Partial<Montlhy_balance>,
    )
    await monthly_balanceService.save(monthly_balance)

    ctx.body = monthly_balance
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteMonthly_balance = async (ctx: Context) => {
  const params = monthlyBalanceParamsSchema.parse(ctx.params)

  try {
    const monthly_balance = await monthly_balanceService.findOne({
      where: { id: params.id },
    })

    if (!monthly_balance) {
      ctx.throw(404, 'monthly_balance not found')
    }

    await monthly_balanceService.softRemove(monthly_balance)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}
