import Router from '@koa/router'
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetPassword,
} from '../controllers/user.controller.js'
import { admin } from '../middlewares/admin.middleware.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = new Router({
  prefix: '/users',
})

router.post('/', createUser)
router.get('/', getUsers)
router.patch('/reset-password', auth, resetPassword)  
router.get('/:id', auth, admin, getUserById)
router.patch('/:id', updateUser)                       
router.delete('/:id', auth, admin, deleteUser)

export default router