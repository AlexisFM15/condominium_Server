import Router from '@koa/router'
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/service.controller.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = new Router({
  prefix: '/services',
})

router.post('/', auth, Operador, createService)
router.get('/', auth, Operador, getServices)
router.get('/:id', auth, Operador, getServiceById)
router.put('/:id', auth, Operador, updateService)
router.delete('/:id', auth, Operador, deleteService)

export default router
