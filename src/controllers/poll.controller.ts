import { Context } from 'koa'
import {
  createPollSchema,
  updatePollSchema,
  pollParamsSchema,
} from '../schemas/poll.schema.js'
import { pollService } from '../services/poll.service.js'
import { Poll } from '../models/poll.model.js'

// CREATE
export const createPoll = async (ctx: Context) => {
  const result = createPollSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const poll = pollService.create(result.data)
    await pollService.save(poll)

    ctx.status = 201
    ctx.body = poll
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ALL
export const getPolls = async (ctx: Context) => {
  try {
    const polls = await pollService.find({
      relations: ['user'],
    })

    ctx.body = polls
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getPollById = async (ctx: Context) => {
  const params = pollParamsSchema.parse(ctx.params)

  try {
    const poll = await pollService.findOne({
      where: { id: params.id },
      relations: ['user'],
    })

    if (!poll) {
      ctx.throw(404, 'poll not found')
    }

    ctx.body = poll
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updatePoll = async (ctx: Context) => {
  const params = pollParamsSchema.parse(ctx.params)

  try {
    const result = updatePollSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const poll = await pollService.findOne({
      where: { id: params.id },
    })

    if (!poll) {
      ctx.throw(404, 'poll not found')
    }

    pollService.merge(poll, result.data as Partial<Poll>)
    await pollService.save(poll)

    ctx.body = poll
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deletePoll = async (ctx: Context) => {
  const params = pollParamsSchema.parse(ctx.params)

  try {
    const poll = await pollService.findOne({
      where: { id: params.id },
    })

    if (!poll) {
      ctx.throw(404, 'poll not found')
    }

    await pollService.softRemove(poll)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}
