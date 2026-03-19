import Router from '@koa/router'
import {
  createPoll,
  getPolls,
  getPollById,
  updatePoll,
  deletePoll,
} from '../controllers/poll.controller.js'

const router = new Router({
  prefix: '/polls',
})

router.post('/', createPoll)
router.get('/', getPolls)
router.get('/:id', getPollById)
router.put('/:id', updatePoll)
router.delete('/:id', deletePoll)

export default router
