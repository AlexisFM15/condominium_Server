import { CronJob } from 'cron'
import database from '../config/database.js'
import { billService } from '../services/bill.service.js'
import { BillStatus } from '../utils/enums.js'

const billingDue = async () => {
  if (!database.appDataSource.isInitialized) {
    await database.initializeDB()
  }

  try {
    const job = CronJob.from({
      cronTime: '0 0 * * *', // every night at midnight
      onTick: async () => {
        const today = new Date()
        // search at least one overdue bill for validation
        const billDateValidation =
          await billService.findOneByPendingStatusValidation()
        try {
          // skip process if dont found any overdue bill
          if (!billDateValidation) {
            return
          }
          const notPaidBills = await billService.findByPendingStatus()

          for (const bill of notPaidBills) {
            //skip if the bill has a latefee already applied or the due time is not done
            if (bill.lateFeeStatus === true || bill.due_date > today) {
              continue
            }
            bill.latefee =
              bill.amount * (bill.apartment.building.condominium.latefee_amount / 100)
            bill.status = BillStatus.OVERDUE
            bill.lateFeeStatus = true
            await billService.save(bill)
          }
        } catch (error) {
          console.log(error)
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

billingDue()
