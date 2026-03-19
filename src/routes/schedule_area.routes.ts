import Router from '@koa/router'
import {
  createsShedule_area,
  getSchedule_areas,
  getSchedule_areaById,
  updateSchedule_area,
  deleteSchedule_area,
} from '../controllers/schedule_area.controller.js'

const router = new Router({
  prefix: '/schedule_areas',
})

router.post('/', createsShedule_area)
router.get('/', getSchedule_areas)
router.get('/:id', getSchedule_areaById)
router.put('/:id', updateSchedule_area)
router.delete('/:id', deleteSchedule_area)

export default router
