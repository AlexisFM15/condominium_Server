import { CronJob } from 'cron'
import database from '../config/database.js'
import { billService } from '../services/bill.service.js'
import { BillStatus } from '../utils/enums.js'
import { apartmentService } from '../services/apartment.service.js'
import { monthly_balanceService } from '../services/monthly_balance.service.js'

// this worker function is daily validate if is a diferent month
// to generate a draft to this monthly bills
export const billsMonthlyGenereation = async () => {
  await database.initializeDB()
  const today = new Date()

  try {
    const lastBillMonth = await billService.findLast()
    const lastMonthBalance = await monthly_balanceService.findLast()

    const job = CronJob.from({
      cronTime: '0 0 * * *',
      // '0 0 * * *', // -> every night at midnight
      onTick: async () => {
        if (
          lastMonthBalance?.month !==
          today.toLocaleString('es-DO', { month: 'long' })
        ) {
          const newMonthlyBalance = {
            income: 0,
            expoenses: 0,
            year: `${today.getFullYear()}`,
            month: `${today.toLocaleString('es-DO', { month: 'long' })}`,
            total: 0,
          }
          await monthly_balanceService.save(newMonthlyBalance)
        }
        if (
          lastBillMonth?.month !==
          today.toLocaleString('es-DO', { month: 'long' })
        ) {
          const apartment = await apartmentService.findForBills()
          // create a bill to every apartment existent
          for (const apa of apartment) {
            const bill = await billService.create({
              amount: apa.rent + apa.building.serviceCost,
              status: BillStatus.DRAFT,
              due_date: '0000-00-00',
              year: `${today.getFullYear()}`,
              month: `${today.toLocaleString('es-DO', { month: 'long' })}`,
              gas_metric: 0,
              gas_total: 0,
              gas_pic: '',
              apartment: { id: apa.id },
            })
            await billService.save(bill)
          }
        }
      },
      start: true,
      timeZone: 'America/Santo_Domingo',
    })
    return job
  } catch (error) {
    console.log(error)
  }
}

billsMonthlyGenereation()
