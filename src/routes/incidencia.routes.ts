import Router from '@koa/router'
import incidenciaRoutes from './incidencia.routes.js'
import {
  createIncidencia,
  getIncidencias,
  getIncidenciaById,
  updateIncidencia,
  deleteIncidencia,
} from '../controllers/incidencia.controller.js'
import { auth } from '../middlewares/auth.middleware.js'


const router = new Router({
  prefix: '/incidencias',
})



router.post('/', auth, createIncidencia)
router.get('/', auth, getIncidencias)
router.get('/:id', auth, getIncidenciaById)
router.patch('/:id', auth, updateIncidencia)
router.delete('/:id', auth, deleteIncidencia)

export default router