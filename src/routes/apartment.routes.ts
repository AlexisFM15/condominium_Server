import Router from '@koa/router'
import {
  createApartment,
  getApartments,
  getApartmentById,
  updateApartment,
  deleteApartment,
} from '../controllers/apartment.controller.js'

const router = new Router({
  prefix: '/apartments',
})

router.post('/', createApartment)
router.get('/', getApartments)
router.get('/:id', getApartmentById)
router.put('/:id', updateApartment)
router.delete('/:id', deleteApartment)

export default router
