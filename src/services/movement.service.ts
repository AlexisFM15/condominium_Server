import database from '../config/database.js'
import { Movement } from '../models/movement.model.js'
import { MovemntType } from '../utils/enums.js'
import { Montlhy_balance } from '../models/monthly_balance.model.js'



export const movementService = database.appDataSource
  .getRepository(Movement)
  .extend({
    findByMonthlyBalance(id: number) {
      return this.createQueryBuilder('m').where('m.Monthly', { id: id })
    },
  })

export interface CreateMovementData {
  type: MovemntType
  description: string
  amount: number
  date: Date
  monthlyBalanceId: number
}

export async function createMovementT(
  data: CreateMovementData,
  type: MovemntType,
) {
  return await database.appDataSource.transaction(async (manager) => {
    const {
      amount,
      description,
      date,
      monthlyBalanceId,
    } = data

    // Buscar balance mensual
    let balance = await manager.findOne(Montlhy_balance, {
      where: {
        id: monthlyBalanceId,
      },
    })

    if (!balance) {
      throw new Error('Monthly balance not found')
    }

    // Crear movimiento
    const movement = manager.create(Movement, {
      amount,
      type,
      description,
      date: new Date(date),
      monthly_balance: balance,
    })

    await manager.save(movement)

    // Actualizar balance
    if (type === MovemntType.EXPENSES) {
      balance.expense =
        Number(balance.expense) + Number(amount)
    }

    if (type === MovemntType.INCOME) {
      balance.income =
        Number(balance.income) + Number(amount)
    }

    // Calcular total
    balance.total =
      Number(balance.income) - Number(balance.expense)

    await manager.save(balance)

    return movement
  })
}

export async function deleteMovementT(id: number) {
  return await database.appDataSource.transaction(async (manager) => {
    const movement = await manager.findOne(Movement, {
      where: {
        id,
      },
      relations: ['monthly_balance'],
    })

    if (!movement) {
      throw new Error('Movement not found')
    }

    const balance = movement.monthly_balance

    if (!balance) {
      throw new Error('Monthly balance not found')
    }

    // Revertir movimiento
    if (movement.type === MovemntType.EXPENSES) {
      balance.expense =
        Number(balance.expense) - Number(movement.amount)
    }

    if (movement.type === MovemntType.INCOME) {
      balance.income =
        Number(balance.income) - Number(movement.amount)
    }

    // Recalcular total
    balance.total =
      Number(balance.income) - Number(balance.expense)

    // Guardar balance
    await manager.save(balance)

    // Soft delete del movimiento
    await manager.softRemove(movement)

    return movement
  })
}