import Router from '@koa/router'
import {
  createBuilding,
  getBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} from '../controllers/building.controller.js'
import { admin } from '../middlewares/admin.middleware.js'
import { auth } from '../middlewares/auth.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'

const router = new Router({
  prefix: '/buildings',
})

router.post('/', auth, admin, createBuilding)
router.get('/', auth, Operador, getBuildings)
router.get('/:id', auth, Operador, getBuildingById)
router.put('/:id', auth, admin, updateBuilding)
router.delete('/:id', auth, admin, deleteBuilding)

export default router
