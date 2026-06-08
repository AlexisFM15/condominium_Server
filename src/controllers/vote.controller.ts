import { Context } from 'koa'
import {
  createVoteSchema,
  updateVoteSchema,
  voteParamsSchema,
} from '../schemas/vote.schema.js'
import { voteService } from '../services/vote.service.js'
import { Vote } from '../models/vote.model.js'
import { VoteType } from '../utils/enums.js'
import { pollService } from '../services/poll.service.js'
import { userService } from '../services/user.service.js'

// CREATE
export const createVote = async (ctx: Context) => {
  const result = createVoteSchema.safeParse(ctx.request.body)
  console.log(result)
  const userId = ctx.state.user.userId
  try {
 const user = await userService.findOne({
  where: {
    id: userId,
  },
})

if (!user) {
  ctx.throw(404, 'User not found')
}

const poll = await pollService.findOne({
  where: {
    id: result.data!.pollId,
  },
})

if (!poll) {
  ctx.throw(404, 'Poll not found')
}

console.log({
  vote: result.data?.vote,
  user,
  poll,
})

const vote = voteService.create({
  vote: result.data!.vote,
  user,
  poll
})

await voteService.save(vote)
if (!poll) {
  ctx.throw(404, 'Poll not found')
}
    if (vote.vote === VoteType.FAVOR) {
      poll.votesFor++
} else {
  poll.votesAgainst++
}

await pollService.save(poll)

    ctx.status = 201
    ctx.body = vote
  } catch (error) {
    ctx.status = 500
    console.log(error)
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getVotes = async (ctx: Context) => {
  try {
    const votes = await voteService.find({
      relations: ['user', 'poll'],
    })

    ctx.body = votes
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getVoteById = async (ctx: Context) => {
  const params = voteParamsSchema.parse(ctx.params)

  try {
    const vote = await voteService.findOne({
      where: { id: params.id },
      relations: ['user', 'poll'],
    })

    if (!vote) {
      ctx.throw(404, 'vote not found')
    }

    ctx.body = vote
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updateVote = async (ctx: Context) => {
  const params = voteParamsSchema.parse(ctx.params)

  try {
    const result = updateVoteSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const vote = await voteService.findOne({
      where: { id: params.id },
    })

    if (!vote) {
      ctx.throw(404, 'vote not found')
    }

    voteService.merge(vote, result.data as Partial<Vote>)
    await voteService.save(vote)

    ctx.body = vote
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteVote = async (ctx: Context) => {
  const params = voteParamsSchema.parse(ctx.params)

  try {
    const vote = await voteService.findOne({
      where: { id: params.id },
    })

    if (!vote) {
      ctx.throw(404, 'vote not found')
    }

    await voteService.softRemove(vote)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

export const getVoteByUser = async (ctx: Context) => {
const userId = ctx.state.user.userId
  try {
    const vote = await voteService.find({
      where: { user: userId },
      relations: ['user', 'poll'],
    })

    if (!vote) {
      ctx.throw(404, 'vote not found')
    }

    ctx.body = vote
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}