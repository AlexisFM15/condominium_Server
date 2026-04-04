import Router from '@koa/router'
import {
  createMovement,
  getMovements,
  getMovementById,
  updateMovement,
  deleteMovement,
} from '../controllers/movement.controller.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'
import { auth } from '../middlewares/auth.middleware.js'
import { admin } from '../middlewares/admin.middleware.js'

const router = new Router({
  prefix: '/movements',
})

router.post('/', auth, Operador, createMovement)
router.get('/', auth, Operador, getMovements)
router.get('/:id', auth, Operador, getMovementById)
router.put('/:id', auth, admin, updateMovement)
router.delete('/:id', auth, admin, deleteMovement)

export default router
