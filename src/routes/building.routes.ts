import Router from '@koa/router'
import {
  createBuilding,
  getBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} from '../controllers/building.controller.js'

const router = new Router({
  prefix: '/buildings',
})

router.post('/', createBuilding)
router.get('/', getBuildings)
router.get('/:id', getBuildingById)
router.put('/:id', updateBuilding)
router.delete('/:id', deleteBuilding)

export default router
