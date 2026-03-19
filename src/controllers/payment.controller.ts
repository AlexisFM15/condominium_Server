import { Context } from 'koa'
import {
  createPaymentSchema,
  updatePaymentSchema,
  paymentParamsSchema,
} from '../schemas/payment.schema.js'
import { paymentService } from '../services/payment.service.js'
import { Payment } from '../models/payment.model.js'

// CREATE
export const createPayment = async (ctx: Context) => {
  const result = createPaymentSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const payment = paymentService.create(result.data)
    await paymentService.save(payment)

    ctx.status = 201
    ctx.body = payment
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getPayments = async (ctx: Context) => {
  try {
    const payments = await paymentService.find({
      relations: ['building'],
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
      relations: ['building'],
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
