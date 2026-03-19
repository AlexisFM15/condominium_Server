import Router from '@koa/router'
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from '../controllers/service.controller.js'

const router = new Router({
  prefix: '/services',
})

router.post('/', createService)
router.get('/', getServices)
router.get('/:id', getServiceById)
router.put('/:id', updateService)
router.delete('/:id', deleteService)

export default router
