import Router from '@koa/router'
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  sendBill,
} from '../controllers/bill.controller.js'

const router = new Router({
  prefix: '/bills',
})

router.post('/', createBill)
router.get('/', getBills)
router.get('/:id', getBillById)
router.put('/:id', updateBill)
router.delete('/:id', deleteBill)
router.put('/send/:id', sendBill)

export default router
