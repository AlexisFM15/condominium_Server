import Router from '@koa/router'
import {
  createCondominium,
  getCondominiums,
  getCondominiumById,
  updateCondominium,
  deleteCondominium,
} from '../controllers/condominium.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { admin } from '../middlewares/admin.middleware.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'

const router = new Router({
  prefix: '/condominiums',
})

router.post('/', auth, admin, createCondominium)
router.get('/', auth, Operador, getCondominiums)
router.get('/:id', auth, Operador, getCondominiumById)
router.put('/:id', auth, admin, updateCondominium)
router.delete('/:id', auth, admin, deleteCondominium)

export default router
