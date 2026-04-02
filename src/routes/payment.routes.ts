import Router from '@koa/router'
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  createExtraPayment,
} from '../controllers/payment.controller.js'

const router = new Router({
  prefix: '/payments',
})

router.post('/', createPayment)
router.post('/extra', createExtraPayment)
router.get('/', getPayments)
router.get('/:id', getPaymentById)
router.put('/:id', updatePayment)
router.delete('/:id', deletePayment)

export default router
