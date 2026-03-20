import { CronJob } from 'cron'
import database from '../config/database.js'
import { billService } from '../services/bill.service.js'
import { BillStatus, occupancyType } from '../utils/enums.js'
import { apartmentService } from '../services/apartment.service.js'

// this worker function is daily validate if is a diferent month
// to generate a draft to this monthly bills
export const billsMonthlyGenereation = async () => {
  await database.initializeDB()
  const today = new Date()

  try {
    const lastBillMonth = await billService.findLast()

    const job = CronJob.from({
      cronTime: '0 0 * * *', // -> every nigth,
      onTick: async () => {
        if (
          lastBillMonth?.month !==
          today.toLocaleString('es-DO', { month: 'long' })
        ) {
          const apartment = await apartmentService.find({
            relations: ['building', 'user'],
          })
          // create a bill to evrey apartment existent
          apartment.forEach((apa) => {
            const bill = billService.create({
              amount: apa.rent,
              status: BillStatus.PENDING,
              due_date: '2026-03-01',
              year: `${today.getFullYear()}`,
              month: `${today.toLocaleString('es-DO', { month: 'long' })}`,
              gas_pic: '',
              apartment: { id: apa.id },
            })
            billService.save(bill)
          })
        }
        return
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
