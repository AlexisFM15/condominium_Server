import Router from '@koa/router'
import {
  createMovement,
  getMovements,
  getMovementById,
  updateMovement,
  deleteMovement,
} from '../controllers/movement.controller.js'

const router = new Router({
  prefix: '/movements',
})

router.post('/', createMovement)
router.get('/', getMovements)
router.get('/:id', getMovementById)
router.put('/:id', updateMovement)
router.delete('/:id', deleteMovement)

export default router
