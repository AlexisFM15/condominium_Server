import Router from '@koa/router'
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js'

const router = new Router({
  prefix: '/users',
})

router.post('/', createUser)
router.get('/', getUsers)
router.get('/:id', getUserById)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
