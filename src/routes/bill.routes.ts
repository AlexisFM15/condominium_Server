import Router from '@koa/router'
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  sendBill,
  payBill,
  getDraftBills,
  getPendingBills,
} from '../controllers/bill.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { admin } from '../middlewares/admin.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'
import { upload } from '../libs/multer.js'

const router = new Router({
  prefix: '/bills',
})

router.post('/',upload.single('gas_pic'), createBill)
router.get('/draft', Operador, getDraftBills)
router.get('/pending',Operador, getPendingBills)
router.get('/',  Operador, getBills)
router.get('/:id', auth, getBillById)
router.patch('/:id', upload.single('gas_pic'),admin, updateBill)
router.delete('/:id',  admin, deleteBill)
router.patch('/send/:id',Operador,upload.single('gas_pic'), sendBill)
router.post('/paybill/:id', Operador, payBill)


export default router
