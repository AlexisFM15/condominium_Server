import { Context } from 'koa'
import {
  createPaymentSchema,
  updatePaymentSchema,
  paymentParamsSchema,
} from '../schemas/payment.schema.js'
import { paymentService } from '../services/payment.service.js'
import { Payment } from '../models/payment.model.js'
import { movementService } from '../services/movement.service.js'
import { MovemntType } from '../utils/enums.js'
import { monthly_balanceService } from '../services/monthly_balance.service.js'

// CREATE
export const createPayment = async (ctx: Context) => {
  const result = createPaymentSchema.safeParse(ctx.request.body)
  const today = new Date().toLocaleDateString('es-DO', { month: 'long' })
  const todayMove = new Date().toISOString()

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const payment = paymentService.create(result.data)
    console.log(payment)
    await paymentService.save(payment)

    const monthlyBalance = await monthly_balanceService.findByMonth(`${today}`)

    console.log(today)
    console.log(monthlyBalance)
    if (!monthlyBalance) {
      ctx.throw(404, 'not Found1213')
    }

    const newMovement = await movementService.create({
      amount: result.data.amount,
      name: MovemntType.EXPENSES,
      description: `Se hizo un pago por ${payment.paymentType}, No ${payment.id}`,
      date: todayMove,
      monthly_balance: { id: monthlyBalance.id },
    })
    await movementService.save(newMovement)

    ctx.status = 201
    ctx.body = payment
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
    console.log(error)
  }
}

// GET ALL
export const getPayments = async (ctx: Context) => {
  try {
    const payments = await paymentService.find({
      relations: [''],
    })

    ctx.body = payments
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getPaymentById = async (ctx: Context) => {
  const params = paymentParamsSchema.parse(ctx.params)

  try {
    const payment = await paymentService.findOne({
      where: { id: params.id },
      relations: [''],
    })

    if (!payment) {
      ctx.throw(404, 'payment not found')
    }

    ctx.body = payment
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updatePayment = async (ctx: Context) => {
  const params = paymentParamsSchema.parse(ctx.params)

  try {
    const result = updatePaymentSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const payment = await paymentService.findOne({
      where: { id: params.id },
    })

    if (!payment) {
      ctx.throw(404, 'payment not found')
    }

    paymentService.merge(payment, result.data as Partial<Payment>)
    await paymentService.save(payment)

    ctx.body = payment
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deletePayment = async (ctx: Context) => {
  const params = paymentParamsSchema.parse(ctx.params)

  try {
    const payment = await paymentService.findOne({
      where: { id: params.id },
    })

    if (!payment) {
      ctx.throw(404, 'payment not found')
    }

    await paymentService.softRemove(payment)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}
