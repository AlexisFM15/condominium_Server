import { Context } from 'koa'
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
} from '../schemas/user.schema.js'
import { userService } from '../services/user.service.js'
import { User } from '../models/user.model.js'
import { Rol } from '../utils/enums.js'

// CREATE
export const createUser = async (ctx: Context) => {
  const result = createUserSchema.safeParse(ctx.request.body)

  try {
    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const user = userService.create({
      name: result.data.name,
      lastname: result.data.lastname,
      phone: result.data.phone,
      email: result.data.email,
      password: result.data.password,
      role: result.data.role || Rol.CONDOMINIUM,
      apartment: result.data.apartmentId ? { id: result.data.apartmentId } : {},
    })
    await userService.save(user)

    ctx.status = 201
    ctx.body = user
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
    console.log(error)
  }
}

// GET ALL
export const getUsers = async (ctx: Context) => {
  try {
    const users = await userService.find({
      relations: ['apartment'],
    })

    ctx.body = users
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// GET ONE
export const getUserById = async (ctx: Context) => {
  const params = userParamsSchema.parse(ctx.params)

  try {
    const user = await userService.findOne({
      where: { id: params.id },
    })

    if (!user) {
      ctx.throw(404, 'user not found')
    }

    ctx.body = user
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
    console.log(error)
  }
}

// UPDATE
export const updateUser = async (ctx: Context) => {
  const params = userParamsSchema.parse(ctx.params)

  try {
    const result = updateUserSchema.safeParse(ctx.request.body)

    if (!result.success) {
      ctx.throw(400, result.error)
    }

    const user = await userService.findOne({
      where: { id: params.id },
    })

    if (!user) {
      ctx.throw(404, 'user not found')
    }

    userService.merge(user, result.data as Partial<User>)
    await userService.save(user)

    ctx.body = user
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

// DELETE (soft delete)
export const deleteUser = async (ctx: Context) => {
  const params = userParamsSchema.parse(ctx.params)

  try {
    const user = await userService.findOne({
      where: { id: params.id },
    })

    if (!user) {
      ctx.throw(404, 'user not found')
    }

    await userService.softRemove(user)

    ctx.status = 204
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
    console.log(error)
  }
}
