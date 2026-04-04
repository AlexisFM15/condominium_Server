import Router from '@koa/router'
import {
  createMonthly_balance,
  getMonthly_balances,
  getMonthly_balanceById,
  updateMonthly_balance,
  deleteMonthly_balance,
} from '../controllers/monthly_balance.controller.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'
import { auth } from '../middlewares/auth.middleware.js'
import { admin } from '../middlewares/admin.middleware.js'

const router = new Router({
  prefix: '/monthlybalances',
})

router.post('/', auth, admin, createMonthly_balance)
router.get('/', auth, Operador, getMonthly_balances)
router.get('/:id', auth, Operador, getMonthly_balanceById)
router.put('/:id', auth, admin, updateMonthly_balance)
router.delete('/:id', auth, admin, deleteMonthly_balance)

export default router
