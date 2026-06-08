import Router from '@koa/router'
import {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
  deleteArea,
} from '../controllers/area.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'

const router = new Router({
  prefix: '/areas',
})

router.post('/',  createArea)
router.get('/', auth, Operador, getAreas)
router.get('/:id', auth, getAreaById)
router.put('/:id', auth, Operador, updateArea)
router.delete('/:id', auth, Operador, deleteArea)

export default router
