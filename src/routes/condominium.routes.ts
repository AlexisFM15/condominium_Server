import Router from '@koa/router'
import {
  createCondominium,
  getCondominiums,
  getCondominiumById,
  updateCondominium,
  deleteCondominium,
} from '../controllers/condominium.controller.js'
import { admin } from '../middlewares/admin.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'

const router = new Router({
  prefix: '/condominiums',
})

router.post('/', createCondominium)
router.get('/', Operador, getCondominiums)
router.get('/:id', Operador, getCondominiumById)
router.patch('/:id',  updateCondominium)
router.delete('/:id', admin, deleteCondominium)

export default router
