import { Context } from 'koa'
import {
  createBillSchema,
  updateBillSchema,
  billParamsSchema,
  sendBillSchema,
} from '../schemas/bill.schema.js'
import { billService } from '../services/bill.service.js'
import { Bill } from '../models/bill.model.js'
import { BillStatus, MovemntType, Payment_type } from '../utils/enums.js'
import { sendBillEmail } from '../helpers/mailing.js'
import { htmlBIlls, subjects } from '../utils/emailsFormart.js'
import { apartmentService } from '../services/apartment.service.js'
import { createPaymentT } from '../services/payment.service.js'
import { calculateGasBill } from '../utils/gasFormat.js'
import { StorageService } from '../services/storage.service.js'

// CREATE
export const createBill = async (ctx: Context) => {
  const result = createBillSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    let gasPic: string | null = null

    if (ctx.file) {
      const uploaded = await StorageService.upload(ctx.file)
      gasPic = uploaded.url
    }

    const bill = billService.create({
      amount: result.data.amount,
      status: result.data.status || BillStatus.PENDING,
      due_date: result.data.due_date,
      year: result.data.year,
      month: result.data.month,

      gas_pic: gasPic,

      apartment: {
        id: result.data.apartmentId,
      },
    })

    await billService.save(bill)

    ctx.status = 201
    ctx.body = bill
  } catch (error) {
    console.error(error)

    ctx.status = 500
    ctx.body = {
      message: 'Error connecting to the server',
    }
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
    console.log(ctx.file)

    const result = updateBillSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const bill = await billService.findOne({
      where: { id: params.id },
      relations: ['apartment'],
    })

    if (!bill) {
      ctx.throw(404, 'Bill not found')
    }

    // ← SUBIR LA IMAGEN SI EXISTE
    if (ctx.file) {
      const uploaded = await StorageService.upload(ctx.file)

      bill.gas_pic = uploaded.url
    }

    const { apartmentId, ...billData } = result.data

    billService.merge(bill, billData as Partial<Bill>)

    if (apartmentId) {
      const apartment = await apartmentService.findOne({
        where: { id: apartmentId },
      })

      if (!apartment) {
        ctx.throw(404, 'Apartment not found')
      }

      bill.apartment = apartment
    }

    await billService.save(bill)

    ctx.body = bill
  } catch (error) {
    console.error(error)
    ctx.throw(500, 'Error connecting to the server')
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

export const sendBill = async (ctx: Context) => {
  try {
    console.log('========== PATCH /bills/:id ==========')

    // --------------------------------------------------
    // 1. VALIDAR PARAMS
    // --------------------------------------------------

    const paramsResult = billParamsSchema.safeParse(ctx.params)

    if (!paramsResult.success) {
      ctx.status = 400
      ctx.body = {
        message: 'Invalid bill id',
        errors: paramsResult.error.flatten(),
      }
      return
    }

    const { id } = paramsResult.data

    console.log('Bill ID:', id)

    // --------------------------------------------------
    // 2. VALIDAR BODY
    // --------------------------------------------------

    const bodyResult = sendBillSchema.safeParse(ctx.request.body)

    if (!bodyResult.success) {
      console.log('Body validation error:', bodyResult.error)

      ctx.status = 400
      ctx.body = {
        message: 'Invalid request data',
        errors: bodyResult.error.flatten(),
      }

      return
    }

    const data = bodyResult.data

    console.log('Validated body:', data)

    // --------------------------------------------------
    // 3. BUSCAR FACTURA
    // --------------------------------------------------

    console.log('Searching bill...')

    const bill = await billService.findOne({
      where: {
        id,
      },
      relations: ['apartment'],
    })

    if (!bill) {
      ctx.status = 404
      ctx.body = {
        message: 'Bill not found',
      }

      return
    }

    console.log('Bill found:', bill.id)

    // --------------------------------------------------
    // 4. BUSCAR INFORMACIÓN DEL APARTAMENTO
    // --------------------------------------------------

    console.log('Searching apartment user...')

    const apartmentUser = await apartmentService.findForSendBill(
      bill.id,
    )

    if (!apartmentUser) {
      ctx.status = 404
      ctx.body = {
        message: 'Apartment user not found',
      }

      return
    }

    console.log('Apartment user found')

    // --------------------------------------------------
    // 5. FECHA DE VENCIMIENTO
    // --------------------------------------------------

    const dueDate = new Date()

    const timeLimitDays =
      apartmentUser.building.condominium.time_limit_days

    dueDate.setDate(
      dueDate.getDate() + timeLimitDays,
    )

    console.log('Due date:', dueDate)

    // --------------------------------------------------
    // 6. CALCULAR GAS
    // --------------------------------------------------

    console.log('Calculating gas...')

    const gas = calculateGasBill(
      apartmentUser.lastGasMetric,
      data.gasMetric,
      apartmentUser.building.condominium.latefee_amount,
    )

    console.log('Gas result:', gas)

    // --------------------------------------------------
    // 7. ACTUALIZAR FACTURA
    // --------------------------------------------------

    bill.status = data.status ?? BillStatus.PENDING

    bill.gas_metric = data.gasMetric

    bill.due_date = dueDate

    bill.gas_total = gas.amount

    // --------------------------------------------------
    // 8. SUBIR IMAGEN
    // --------------------------------------------------

    if (ctx.file) {
      console.log('Uploading gas image...')

      console.log({
        fieldname: ctx.file.fieldname,
        originalname: ctx.file.originalname,
        mimetype: ctx.file.mimetype,
        size: ctx.file.size,
      })

      const uploaded = await StorageService.upload(ctx.file)

      console.log('Image uploaded:', uploaded)

      bill.gas_pic = uploaded.url

      console.log('gas_pic:', bill.gas_pic)
    } else {
      console.log('No gas image received')
    }

    // --------------------------------------------------
    // 9. GUARDAR FACTURA
    // --------------------------------------------------

    console.log('Saving bill...')

    const savedBill = await billService.save(bill)

    console.log('Bill saved:', savedBill)

    // --------------------------------------------------
    // 10. ACTUALIZAR MÉTRICA
    // --------------------------------------------------

    console.log('Updating apartment gas metric...')

    apartmentUser.lastGasMetric = data.gasMetric

    await apartmentService.save(apartmentUser)

    console.log('Apartment metric updated')

    // --------------------------------------------------
    // 11. RESPONDER AL CLIENTE
    // --------------------------------------------------

    ctx.status = 200

    ctx.body = {
      message: 'Bill sent successfully',
      bill: savedBill,
    }

    // --------------------------------------------------
    // 12. ENVIAR EMAIL
    // --------------------------------------------------
    //
    // IMPORTANTE:
    // El email NO debe impedir que el PATCH
    // responda correctamente.
    //
    // --------------------------------------------------

    try {
      console.log('Sending bill email...')

      await sendBillEmail(
        subjects.billSubject,
        apartmentUser.user.email,
        htmlBIlls(
          bill.amount + gas.amount,
          bill.due_date,
          bill.year,
          bill.month,
          bill.gas_pic,
        ),
      )

      console.log('Bill email sent successfully')
    } catch (emailError) {
      console.error(
        'Error sending bill email:',
        emailError,
      )
    }

    console.log('========== PATCH COMPLETED ==========')
  } catch (error) {
    console.error('========== PATCH ERROR ==========')
    console.error(error)

    // -----------------------------------------------
    // Si Koa ya tiene un status de error, respetarlo
    // -----------------------------------------------

    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      typeof error.status === 'number'
    ) {
      ctx.status = error.status

      ctx.body = {
        message:
          'message' in error
            ? error.message
            : 'Request error',
      }

      return
    }

    // -----------------------------------------------
    // Error inesperado
    // -----------------------------------------------

    ctx.status = 500

    ctx.body = {
      message: 'Internal server error',
    }
  }
}

//pay bills
export const payBill = async (ctx: Context) => {

  const resultParams = billParamsSchema.parse(ctx.params)
  const { reference, payment_method } = ctx.request.body
  console.log(reference, payment_method, resultParams)
  try {
    const bill = await billService.findOneByPendingStatus(resultParams.id)

    if (!bill) {
      ctx.throw(404, 'not Found')
    }
    bill.status = BillStatus.PAID
    await billService.save(bill)

   const newPayment = {
  amount:
    Number(String(bill.amount).replace(/\./g, '')) +
    Number(String(bill.gas_total ?? 0).replace(/\./g, '')),
  payment_date: bill.fecha_registro,
  description: `Pago de factura No.${bill.id} del apartamento No. ${bill.apartment.number}`,
  reference,
  paymentType: Payment_type.BILL,
  payment_method,
}

    await createPaymentT(newPayment, MovemntType.INCOME)

    await sendBillEmail(
      subjects.billSubject,
      'maximoalexisflorianmatos@gmail.com',
      htmlBIlls(
        bill.amount ,
        bill.due_date,
        bill.year,
        bill.month,
        bill.gas_pic,
      ),
    )
    
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET BILLS - DRAFT
export const getDraftBills = async (ctx: Context) => {
  try {
    const bills = await billService.find({
      where: {
        status: BillStatus.DRAFT,
      },
      relations: ['apartment'],
    })

    console.log(bills)
    ctx.body = bills
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to connect to the server' }
    console.log(error)
  }
}

// GET BILLS - PENDING
export const getPendingBills = async (ctx: Context) => {
  try {
    const bills = await billService.find({
      where: {
        status: BillStatus.PENDING,
      },
      relations: ['apartment'],
    })

    ctx.body = bills
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to connect to the server' }
    console.log(error)
  }
}
