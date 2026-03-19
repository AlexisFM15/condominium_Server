import Router from '@koa/router'
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} from '../controllers/bill.controller.js'

const router = new Router({
  prefix: '/bills',
})

router.post('/', createBill)
router.get('/', getBills)
router.get('/:id', getBillById)
router.put('/:id', updateBill)
router.delete('/:id', deleteBill)

export default router
