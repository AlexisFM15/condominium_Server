import { Context } from 'koa'
import {
  createVoteSchema,
  updateVoteSchema,
  voteParamsSchema,
} from '../schemas/vote.schema.js'
import { voteService } from '../services/vote.service.js'
import { Vote } from '../models/vote.model.js'

// CREATE
export const createVote = async (ctx: Context) => {
  const result = createVoteSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const vote = voteService.create({ ...result.data })
    await voteService.save(vote)

    ctx.status = 201
    ctx.body = vote
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getVotes = async (ctx: Context) => {
  try {
    const votes = await voteService.find({
      relations: ['building'],
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
      relations: ['building'],
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
