import Router from '@koa/router'
import {
  createsShedule_area,
  getSchedule_areas,
  getSchedule_areaById,
  updateSchedule_area,
  deleteSchedule_area,
} from '../controllers/schedule_area.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'
import { admin } from '../middlewares/admin.middleware.js'

const router = new Router({
  prefix: '/schedule_areas',
})

router.post('/', auth, createsShedule_area)
router.get('/', Operador, getSchedule_areas)
router.get('/:id', Operador, getSchedule_areaById)
router.patch('/:id', admin, updateSchedule_area)
router.delete('/:id', admin, deleteSchedule_area)

export default router
