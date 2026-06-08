import Router from '@koa/router'
import {
  createVote,
  getVotes,
  getVoteById,
  updateVote,
  deleteVote,
} from '../controllers/vote.controller.js'
import { Operador } from '../middlewares/OperatorMiddleware.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = new Router({
  prefix: '/votes',
})

router.post('/', auth , createVote)
router.get('/', auth, Operador, getVotes)
router.get('/:id', auth, getVoteById)
router.put('/:id', auth, Operador, updateVote)
router.delete('/:id', auth, Operador, deleteVote)

export default router
