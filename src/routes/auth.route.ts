import Router from '@koa/router'
import { getMe, login, logout } from '../controllers/auth.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { refreshToken } from '../controllers/session.controller.js'
import { getDashboardA } from '../controllers/dashboard.controller.js'

const router = new Router()

router.post('/login', login)
router.get('/profile', auth)
router.post('/logout', auth, logout)
router.post('/refreshToken', refreshToken)
router.get('/me', auth, getMe)
router.get('/dashboard', auth, getDashboardA)

export default router
