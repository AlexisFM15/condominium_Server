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
router.get('/', auth, Operador, admin, getSchedule_areas)
router.get('/:id', auth, getSchedule_areaById)
router.put('/:id', auth, updateSchedule_area)
router.delete('/:id', auth, deleteSchedule_area)

export default router
