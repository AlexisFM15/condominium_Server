import Router from '@koa/router'
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  createExtraPayment,
} from '../controllers/payment.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'
import { admin } from '../middlewares/admin.middleware.js'

const router = new Router({
  prefix: '/payments',
})

router.post('/', auth, Operador, createPayment)
router.post('/extra', auth, Operador, createExtraPayment)
router.get('/', auth, Operador, getPayments)
router.get('/:id', auth, Operador, getPaymentById)
router.put('/:id', auth, admin, updatePayment)
router.delete('/:id', auth, admin, deletePayment)

export default router
