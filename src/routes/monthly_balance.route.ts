import Router from '@koa/router'
import {
  createMonthly_balance,
  getMonthly_balances,
  getMonthly_balanceById,
  updateMonthly_balance,
  deleteMonthly_balance,
} from '../controllers/monthly_balance.controller.js'

const router = new Router({
  prefix: '/monthlybalances',
})

router.post('/', createMonthly_balance)
router.get('/', getMonthly_balances)
router.get('/:id', getMonthly_balanceById)
router.put('/:id', updateMonthly_balance)
router.delete('/:id', deleteMonthly_balance)

export default router
