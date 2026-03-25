import { CronJob } from 'cron'
import database from '../config/database.js'
import { billService } from '../services/bill.service.js'
import { BillStatus } from '../utils/enums.js'
import { apartmentService } from '../services/apartment.service.js'

// this worker function is daily validate if is a diferent month
// to generate a draft to this monthly bills
export const billsMonthlyGenereation = async () => {
  await database.initializeDB()
  const today = new Date()

  try {
    const lastBillMonth = await billService.findLast()

    const job = CronJob.from({
      cronTime: '0 0 * * *',
      // '0 0 * * *', // -> every night at midnight
      onTick: async () => {
        if (
          lastBillMonth?.month !==
          today.toLocaleString('es-DO', { month: 'long' })
        ) {
          const apartment = await apartmentService.findForBills()
          // create a bill to every apartment existent
          for (const apa of apartment) {
            const dueDate = new Date(today)
            today.setDate(
              today.getDate() + apa.building.condominium.time_limit_days,
            )

            const bill = await billService.create({
              amount: apa.rent,
              status: BillStatus.DRAFT,
              due_date: dueDate.toLocaleDateString('en-Do'),
              year: `${today.getFullYear()}`,
              month: `${today.toLocaleString('es-DO', { month: 'long' })}`,
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
