import { Context } from 'koa'
import {
  createBillSchema,
  updateBillSchema,
  billParamsSchema,
} from '../schemas/bill.schema.js'
import { billService } from '../services/bill.service.js'
import { Bill } from '../models/bill.model.js'
import { BillStatus } from '../utils/enums.js'
import { sendBillEmail } from '../helpers/mailing.js'
import { htmlBIlls, subjects } from '../utils/emailsFormart.js'
import { apartmentService } from '../services/apartment.service.js'

// CREATE
export const createBill = async (ctx: Context) => {
  const result = createBillSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const bill = billService.create({
      amount: result.data.amount,
      status: result.data.status || BillStatus.PENDING,
      due_date: result.data.due_date,
      year: result.data.year,
      month: result.data.month,
      gas_pic: result.data.gas_pic,
      apartment: { id: result.data.apartmentId },
    })
    await billService.save(bill)

    ctx.status = 201
    ctx.body = bill
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getBills = async (ctx: Context) => {
  try {
    const bills = await billService.find({
      relations: ['apartment'],
    })

    ctx.body = bills
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
    console.log(error)
  }
}

// GET ONE
export const getBillById = async (ctx: Context) => {
  const params = billParamsSchema.parse(ctx.params)

  try {
    const bill = await billService.findOne({
      where: { id: params.id },
      relations: ['apartmet'],
    })

    if (!bill) {
      ctx.throw(404, 'bill not found')
    }

    ctx.body = bill
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updateBill = async (ctx: Context) => {
  const params = billParamsSchema.parse(ctx.params)

  try {
    const result = updateBillSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const bill = await billService.findOne({
      where: { id: params.id },
    })

    if (!bill) {
      ctx.throw(404, 'bill not found')
    }

    billService.merge(bill, result.data as Partial<Bill>)
    await billService.save(bill)

    ctx.body = bill
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteBill = async (ctx: Context) => {
  const params = billParamsSchema.parse(ctx.params)

  try {
    const bill = await billService.findOne({
      where: { id: params.id },
    })

    if (!bill) {
      ctx.throw(404, 'bill not found')
    }

    await billService.softRemove(bill)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// update bill draft
export const sendBill = async (ctx: Context) => {
  const params = billParamsSchema.parse(ctx.params)
  console.log(params)

  try {
    const result = updateBillSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const bill = await billService.findOne({
      where: { id: params.id },
      relations: ['apartment'],
    })

    if (!bill) {
      ctx.throw(404, 'bill not found')
    }

    billService.merge(bill, result.data as Partial<Bill>)
    await billService.save(bill)

    const apartmentUser = await apartmentService.findOne({
      where: { id: bill.apartment.id },
      relations: ['user'],
    })

    console.log(apartmentUser)

    sendBillEmail(
      subjects.billSubject,
      apartmentUser?.user.email!,
      htmlBIlls(
        bill.amount,
        bill.due_date,
        bill.year,
        bill.month,
        bill.gas_pic,
      ),
    )
    ctx.body = bill
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
    console.log(error)
  }
}
