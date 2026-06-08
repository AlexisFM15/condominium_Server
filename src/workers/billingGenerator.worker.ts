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

  try {
    const job = CronJob.from({
      cronTime: '0 0 * * *',

      onTick: async () => {
        const today = new Date()

        const lastBillMonth = await billService.findLast()
        const lastMonthBalance =
          await monthly_balanceService.findLast()

        if (
          lastMonthBalance?.month !==
          today.toLocaleString('es-DO', { month: 'long' })
        ) {
          const newMonthlyBalance = {
            income: 0,
            expoenses: 0,
            year: `${today.getFullYear()}`,
            month: `${today.toLocaleString('es-DO', {
              month: 'long',
            })}`,
            total: 0,
          }

          await monthly_balanceService.save(newMonthlyBalance)
        }

        if (
          lastBillMonth?.month !==
          today.toLocaleString('es-DO', { month: 'long' })
        ) {
          const apartments =
            await apartmentService.findForBills()

          for (const apa of apartments) {
            const queryRunner =
              database.appDataSource.createQueryRunner()

            await queryRunner.connect()
            await queryRunner.startTransaction()

            try {
              const discount = Math.min(
                Number(apa.user.balance),
                Number(apa.serviceCost),
              )

              const finalAmount =
                Number(apa.serviceCost) - Number(discount)

              const bill = billService.create({
                amount: finalAmount + apa.building.condominium.promo,
                credited_amount: discount,
                status: BillStatus.DRAFT,
                due_date: '0000-00-00',
                year: `${today.getFullYear()}`,
                month: `${today.toLocaleString('es-DO', {
                  month: 'long',
                })}`,
                gas_metric: 0,
                gas_total: 0,
                gas_pic: '',
                apartment: { id: apa.id },
              })

              await queryRunner.manager.save(bill)

              // descontar balance usado
              apa.user.balance =
                Number(apa.user.balance) -
                Number(discount)

              await queryRunner.manager.save(apa.user)

              await queryRunner.commitTransaction()
            } catch (error) {
              await queryRunner.rollbackTransaction()
              console.log(error)
            } finally {
              await queryRunner.release()
            }
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