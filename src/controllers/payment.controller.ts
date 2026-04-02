import { Context } from 'koa'
import {
  createPaymentSchema,
  updatePaymentSchema,
  paymentParamsSchema,
  createExtraPaymentSchema,
} from '../schemas/payment.schema.js'
import { paymentService } from '../services/payment.service.js'
import { createPaymentT } from '../services/payment.service.js'
import { Payment } from '../models/payment.model.js'
import { MovemntType } from '../utils/enums.js'

// CREATE
export const createPayment = async (ctx: Context) => {
  const result = createPaymentSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const payment = await createPaymentT(result.data, MovemntType.EXPENSES)
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

// payments out of rulers
export const createExtraPayment = async (ctx: Context) => {
  const result = createExtraPaymentSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const payment = await createPaymentT(
      {
        description: result.data.description,
        amount: result.data.amount,
        reference: result.data.reference,
        payment_method: result.data.payment_method,
        payment_date: result.data.payment_date,
        paymentType: result.data.paymentType,
      },
      result.data.movementType,
    )
    ctx.status = 201
    ctx.body = payment
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
    console.log(error)
  }
}
