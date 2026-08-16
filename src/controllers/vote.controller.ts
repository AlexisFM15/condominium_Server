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

  if (!result.success) {
    ctx.throw(400, result.error)
  }

  const userId = ctx.state.user.userId

  try {
    const user = await userService.findOne({
      where: { id: userId },
    })

    if (!user) ctx.throw(404, 'User not found')

    const poll = await pollService.findOne({
      where: { id: result.data.pollId },
    })

    if (!poll) ctx.throw(404, 'Poll not found')

    // Buscar si ya existe un voto
    const existingVote = await voteService.findOne({
      where: {
        user: { id: user.id },
        poll: { id: poll.id },
      },
      relations: ['user', 'poll'],
    })

    if (existingVote) {
      // Si no cambió el voto
      if (existingVote.vote === result.data.vote) {
        ctx.body = existingVote
        return
      }

      // Restar el voto anterior
      if (existingVote.vote === VoteType.FAVOR) {
        poll.votesFor--
      } else {
        poll.votesAgainst--
      }

      // Sumar el nuevo voto
      if (result.data.vote === VoteType.FAVOR) {
        poll.votesFor++
      } else {
        poll.votesAgainst++
      }

      existingVote.vote = result.data.vote

      await voteService.save(existingVote)
      await pollService.save(poll)

      ctx.body = existingVote
      return
    }

    // Crear voto por primera vez
    const vote = voteService.create({
      vote: result.data.vote,
      user,
      poll,
    })

    await voteService.save(vote)

    if (vote.vote === VoteType.FAVOR) {
      poll.votesFor++
    } else {
      poll.votesAgainst++
    }

    await pollService.save(poll)

    ctx.status = 201
    ctx.body = vote
  } catch (error) {
    console.error(error)
    ctx.throw(500, 'Error connecting to the server')
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
    console.log(error)
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

    await voteService.delete(vote)

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