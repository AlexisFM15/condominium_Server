import Router from '@koa/router'
import {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
  deleteArea,
} from '../controllers/area.controller.js'

const router = new Router({
  prefix: '/areas',
})

router.post('/', createArea)
router.get('/', getAreas)
router.get('/:id', getAreaById)
router.put('/:id', updateArea)
router.delete('/:id', deleteArea)

export default router
