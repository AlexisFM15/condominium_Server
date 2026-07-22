import Router from '@koa/router'
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  sendBill,
  payBill,
} from '../controllers/bill.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { admin } from '../middlewares/admin.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'

const router = new Router({
  prefix: '/bills',
})

router.post('/', createBill)
router.get('/',  Operador, getBills)
router.get('/:id', auth, getBillById)
router.patch('/:id', admin, updateBill)
router.delete('/:id',  admin, deleteBill)
router.patch('/send/:id',Operador, sendBill)
router.post('/paybill/:id', Operador, payBill)

export default router
