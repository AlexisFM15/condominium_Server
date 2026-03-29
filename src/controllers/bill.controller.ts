import { Context } from 'koa'
import {
  createBillSchema,
  updateBillSchema,
  billParamsSchema,
  sendBillSchema,
} from '../schemas/bill.schema.js'
import { billService } from '../services/bill.service.js'
import { Bill } from '../models/bill.model.js'
import { BillStatus, MovemntType } from '../utils/enums.js'
import { sendBillEmail } from '../helpers/mailing.js'
import { htmlBIlls, subjects } from '../utils/emailsFormart.js'
import { apartmentService } from '../services/apartment.service.js'
import { monthly_balanceService } from '../services/monthly_balance.service.js'
import { movementService } from '../services/movement.service.js'

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

// complete bill draft
export const sendBill = async (ctx: Context) => {
  const params = billParamsSchema.parse(ctx.params)

  try {
    const result = sendBillSchema.safeParse(ctx.request.body)

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
    const today = new Date()

    billService.merge(bill, result.data as Partial<Bill>)

    const apartmentUser = await apartmentService.findForSendBill(bill.id)

    const dueDate = new Date(today)
    today.setDate(
      today.getDate() + apartmentUser?.building.condominium.time_limit_days!,
    )

    const newGasMetric = {
      lastGasMetric: result.data.gasMetric,
    }
    const newbill = {
      gas_metric: result.data.gasMetric,
      due_date: dueDate,
      gas_pic: result.data.gas_pic!,
    }

    await billService.save(newbill)
    await apartmentService.save(newGasMetric)

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

//pay bills
export const payBill = async (ctx: Context) => {
  const result = billParamsSchema.parse(ctx.params)

  try {
    const bill = await billService.findOneByPendingStatus(result.id)

    if (!bill) {
      ctx.throw(404, 'not Found')
    }
    bill!.status = BillStatus.PAID
    await billService.save(bill)

    const monthlyBalance = await monthly_balanceService.findOne({
      where: { month: bill.month },
    })
    if (!monthlyBalance) {
      ctx.throw(404, 'not Found')
    }

    const newMovement = await movementService.create({
      amount: bill.amount + bill.gas_total,
      name: MovemntType.INCOME,
      description: `Pago de factura No.${bill.id} del apartamento No. ${bill.apartment.number}`,
      date: '0000-00-00',
      monthly_balance: { id: monthlyBalance.id },
    })
    await movementService.save(newMovement)
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
    console.log(error)
  }
}
