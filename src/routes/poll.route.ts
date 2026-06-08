import Router from '@koa/router'
import {
  createPoll,
  getPolls,
  getPollById,
  updatePoll,
  deletePoll,
  getPollByActiveStatus,
} from '../controllers/poll.controller.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = new Router({
  prefix: '/polls',
})

router.post('/', Operador,createPoll)
router.get('/s',  auth, getPolls)
router.get('/open',auth, getPollByActiveStatus)
router.get('/:id', getPollById)
router.put('/:id', Operador, updatePoll)
router.delete('/:id',  Operador, deletePoll)

export default router
1