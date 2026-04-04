import Router from '@koa/router'
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js'
import { admin } from '../middlewares/admin.middleware.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = new Router({
  prefix: '/users',
})

router.post('/', auth, admin, createUser)
router.get('/', auth, admin, getUsers)
router.get('/:id', auth, admin, getUserById)
router.put('/:id', auth, admin, updateUser)
router.delete('/:id', auth, admin, deleteUser)

export default router
