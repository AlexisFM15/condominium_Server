import Router from '@koa/router'
import {
  createBuilding,
  getBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} from '../controllers/building.controller.js'
import { admin } from '../middlewares/admin.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'

const router = new Router({
  prefix: '/buildings',
})

router.post('/', createBuilding)
router.get('/',  Operador, getBuildings)
router.get('/:id', Operador, getBuildingById)
router.put('/:id', admin, updateBuilding)
router.delete('/:id', admin, deleteBuilding)

export default router
