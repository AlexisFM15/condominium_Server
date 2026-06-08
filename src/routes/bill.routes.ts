import Router from '@koa/router'
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  sendBill,
} from '../controllers/bill.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { admin } from '../middlewares/admin.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'

const router = new Router({
  prefix: '/bills',
})

router.post('/', createBill)
router.get('/', auth, Operador, getBills)
router.get('/:id', auth, getBillById)
router.put('/:id', auth, admin, updateBill)
router.delete('/:id', auth, admin, deleteBill)
router.put('/send/:id', auth, Operador, sendBill)

export default router
