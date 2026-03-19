import Router from '@koa/router'
import {
  createCondominium,
  getCondominiums,
  getCondominiumById,
  updateCondominium,
  deleteCondominium,
} from '../controllers/condominium.controller.js'

const router = new Router({
  prefix: '/condominiums',
})

router.post('/', createCondominium)
router.get('/', getCondominiums)
router.get('/:id', getCondominiumById)
router.put('/:id', updateCondominium)
router.delete('/:id', deleteCondominium)

export default router
