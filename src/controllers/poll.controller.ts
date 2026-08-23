import { Context } from 'koa'
import {
  createPollSchema,
  updatePollSchema,
  pollParamsSchema,
} from '../schemas/poll.schema.js'
import { pollService } from '../services/poll.service.js'
import { Poll } from '../models/poll.model.js'
import { PollStatus } from '../utils/enums.js'
import { title } from 'node:process'

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
    console.log(error)
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
    console.log(error)
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// UPDATE
export const updatePoll = async (ctx: Context) => {
  try {
    const params = pollParamsSchema.parse(ctx.params)

    const result = updatePollSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.status = 400
      ctx.body = {
        message: 'Invalid poll data',
        errors: result.error.issues,
      }
      return
    }

    const poll = await pollService.findOne({
      where: {
        id: params.id,
      },
    })

    if (!poll) {
      ctx.status = 404
      ctx.body = {
        message: 'Poll not found',
      }
      return
    }

    pollService.merge(poll, result.data as Partial<Poll>)

    const updatedPoll = await pollService.save(poll)

    ctx.status = 200
    ctx.body = updatedPoll

  } catch (error) {
    console.error('Error updating poll:', error)

    ctx.status = 500
    ctx.body = {
      message: 'Error connecting to the server',
    }
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

export const getPollByActiveStatus = async (ctx: Context) => {
  try {
    const userId = ctx.state.user.userId

    const polls = await pollService.findOpenPolls()
    console.log(JSON.stringify(polls, null, 2))

    console.log(userId)
    const result = polls.map((poll) => ({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      votesFor: poll.votesFor,
      votesAgainst: poll.votesAgainst,

      userVote:
        poll.vote.find(
          (vote) => vote.user.id === userId,
        )?.vote ?? null,
    }))

    
// console.log(result)
    ctx.body = result
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { message: 'Error to connect to the server' }
  }
}

export const closePoll = async (ctx: Context) => {
  try {
    const params = pollParamsSchema.parse(ctx.params)

    const poll = await pollService.findOne({
      where: {
        id: params.id,
      },
    })

    if (!poll) {
      ctx.status = 404
      ctx.body = {
        message: 'Poll not found',
      }
      return
    }

    poll.status = 'Cerrada'

    const updatedPoll = await pollService.save(poll)

    ctx.status = 200
    ctx.body = updatedPoll
  } catch (error) {
    console.error('Error closing poll:', error)

    ctx.status = 500
    ctx.body = {
      message: 'Error closing poll',
    }
  }
}