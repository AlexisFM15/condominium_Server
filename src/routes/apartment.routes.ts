import Router from '@koa/router'
import {
  createApartment,
  getApartments,
  getApartmentById,
  updateApartment,
  deleteApartment,
} from '../controllers/apartment.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'

const router = new Router({
  prefix: '/apartments',
})

router.post('/', auth, createApartment)
router.get('/', auth, Operador, getApartments)
router.get('/:id', auth, getApartmentById)
router.put('/:id', auth, updateApartment)
router.delete('/:id', auth, deleteApartment)

export default router
