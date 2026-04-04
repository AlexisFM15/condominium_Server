import Router from '@koa/router'
import {
  createPoll,
  getPolls,
  getPollById,
  updatePoll,
  deletePoll,
} from '../controllers/poll.controller.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = new Router({
  prefix: '/polls',
})

router.post('/', auth, Operador, createPoll)
router.get('/', auth, getPolls)
router.get('/:id', auth, getPollById)
router.put('/:id', auth, Operador, updatePoll)
router.delete('/:id', auth, Operador, deletePoll)

export default router
