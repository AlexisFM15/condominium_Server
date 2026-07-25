import Router from '@koa/router'
import apartmentRoutes from './apartment.routes.js'
import areaRoutes from './area.routes.js'
import authRoutes from '../routes/auth.route.js'
import billRoutes from './bill.routes.js'
import buildingRoutes from './building.routes.js'
import condominiumRoutes from './condominium.routes.js'
import monthlyBalance from './monthly_balance.route.js'
import movementRoutes from './movement.routes.js'
import paymentRoutes from './payment.routes.js'
import pollRoutes from './poll.route.js'
import scheduleAreaRoutes from './schedule_area.routes.js'
import serviceRoutes from './service.routes.js'
// import sessionRoutes from './session.routes.js'
import userRoutes from './user.routes.js'
import voteRoutes from './vote.routes.js'
import incidenciaRoutes from './incidencia.routes.js'

const router = new Router()

router.use(apartmentRoutes.routes())
router.use(apartmentRoutes.allowedMethods())

router.use(areaRoutes.routes())
router.use(areaRoutes.allowedMethods())

router.use(authRoutes.routes())
router.use(authRoutes.allowedMethods())

router.use(billRoutes.routes())
router.use(billRoutes.allowedMethods())

router.use(buildingRoutes.routes())
router.use(buildingRoutes.allowedMethods())

router.use(condominiumRoutes.routes())
router.use(condominiumRoutes.allowedMethods())

router.use(monthlyBalance.routes())
router.use(monthlyBalance.allowedMethods())

router.use(movementRoutes.routes())
router.use(movementRoutes.allowedMethods())

router.use(paymentRoutes.routes())
router.use(paymentRoutes.allowedMethods())

router.use(pollRoutes.routes())
router.use(pollRoutes.allowedMethods())

router.use(scheduleAreaRoutes.routes())
router.use(scheduleAreaRoutes.allowedMethods())

router.use(serviceRoutes.routes())
router.use(serviceRoutes.allowedMethods())

// router.use(sessionRoutes.routes())
// router.use(sessionRoutes.allowedMethods())

router.use(userRoutes.routes())
router.use(userRoutes.allowedMethods())

router.use(voteRoutes.routes())
router.use(voteRoutes.allowedMethods())

router.use(incidenciaRoutes.routes())
router.use(incidenciaRoutes.allowedMethods())

export default router
