import Router from '@koa/router'
import {
  createVote,
  getVotes,
  getVoteById,
  updateVote,
  deleteVote,
} from '../controllers/vote.controller.js'

const router = new Router({
  prefix: '/votes',
})

router.post('/', createVote)
router.get('/', getVotes)
router.get('/:id', getVoteById)
router.put('/:id', updateVote)
router.delete('/:id', deleteVote)

export default router
