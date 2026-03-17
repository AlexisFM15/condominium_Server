import Router from '@koa/router'
import { login } from '../controllers/auth.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { refreshToken } from '../controllers/session.controller.js'

const router = new Router()

router.post('/login', login)
router.get('/profile', auth)
router.post('/logout', auth)
router.get('/refreshToken', refreshToken)

export default router
