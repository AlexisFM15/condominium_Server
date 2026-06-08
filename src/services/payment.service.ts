import { ILike } from 'typeorm'
import database from '../config/database.js'
import { Montlhy_balance } from '../models/monthly_balance.model.js'
import { Movement } from '../models/movement.model.js'
import { Payment } from '../models/payment.model.js'
import { MovemntType } from '../utils/enums.js'

export const paymentService = database.appDataSource.getRepository(Payment)

export async function createPaymentT(data: any, type: MovemntType) {
  return await database.appDataSource.transaction(async (manager) => {
    const {
      amount,
      payment_date,
      description,
      reference,
      paymentType,
      payment_method,
    } = data
    const month = new Date().toLocaleDateString('es-DO', { month: 'long' })
    const year = new Date().toLocaleDateString('es-DO', { year: 'numeric' })

    const date = new Date(payment_date)

    // 1. Crear payment
    const payment = manager.create(Payment, {
      amount,
      payment_date: date,
      description,
      reference,
      paymentType,
      payment_method,
    })

    const pay = await manager.save(payment)

    // 2. Buscar balance
    let balance = await manager
      .createQueryBuilder(Montlhy_balance, 'mb')
      .where('mb.month = :month', { month })
      .andWhere('mb.year = :year', { year })
      .getOne()

    // 3. Crear si no existe
    if (!balance) {
      balance = manager.create(Montlhy_balance, {
        year,
        month,
        income: 0,
        expense: 0,
        total: 0,
      })

      await manager.save(balance)
    }

    // 4. Crear movement
    const movement = manager.create(Movement, {
      amount,
      type,
      description: `${description + ' ' + pay.id}`,
      date,
      monthly_balance: balance,
    })

    await manager.save(movement)

    // 5. Actualizar balance
    if (movement.type === MovemntType.EXPENSES) {
      balance.expense = Number(balance.expense) + Number(amount)
    } else if (movement.type === MovemntType.INCOME) {
      balance.income = Number(balance.income) + Number(amount)
    }
    balance.total = Number(balance.income) - Number(balance.expense)

    await manager.save(balance)

    return payment
  })
}

export async function deletePaymentT(id: number) {
  return await database.appDataSource.transaction(async(manager) => {
     const payment = await manager.findOne(Payment, {
    where: { id },
  })

  await manager.softRemove(id)

const movement = await manager.findOne(Movement, {
  where: {
    description: ILike(`%${id}%`),
  }
  })

const balance = await manager.findOne(Montlhy_balance, {
  where: {
    id: movement!.monthly_balance.id
  }
  })

  if (!movement || !balance) {
  throw new Error('Movement or balance not found')
}

   if (movement.type === MovemntType.EXPENSES) {
      balance.expense = Number(balance.expense) - Number(movement.amount)
    } else if (movement!.type === MovemntType.INCOME) {
      balance.income = Number(balance.income) + Number(movement.amount)
    }
  
  await manager.softRemove(movement)
  await manager.save(balance)

})
}