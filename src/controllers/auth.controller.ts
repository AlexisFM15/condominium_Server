import { Context } from 'koa'
import { Login, User } from '../types.js'
import { userService } from '../services/user.service.js'
import { IncorrectPassword, UserNotFound } from '../utils/errors.js'
import { validatePassword } from '../libs/bcrypt.js'
import { accessToken, refreshToken } from '../libs/jwt.js'
import { sessionService } from '../services/session.service.js'

export const login = async (ctx: Context) => {
  const { email, password } = ctx.request.body as Login
  try {
    const user: User = await userService.findByEmail(email)

    if (!user) {
      throw new UserNotFound()
    }

    const passwordValidation = await validatePassword(
      password,
      user.User_password,
    )

    if (!passwordValidation) {
      throw new IncorrectPassword()
    }

    //accessToken
    const acToken = accessToken(user.User_id!)
    //refreshToken
    const rhToken = refreshToken(user.User_id!)

    const newSession = {
      token: rhToken,
      ip: ctx.request.ip,
      device: ctx.header['user-agent'] ?? 'Unknown',
      user: { id: user.User_id },
    }

    await sessionService.save(newSession)

    ctx.cookies.set('refreshToken', rhToken)
    ctx.status = 200
    ctx.body = { message: 'Access succeed', token: acToken }
    return
  } catch (error) {
    if (error instanceof UserNotFound) {
      ctx.status = error.statusCode
      ctx.body = { message: error.message }
      console.log(error)
      return
    }

    if (error instanceof IncorrectPassword) {
      ctx.status = error.statusCode
      ctx.body = { message: error.message }
      return
    }

    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

export const logout = async (ctx: Context) => {
  const refreshToken = ctx.cookies.get('refreshToken')

  if (refreshToken) {
    await sessionService.delete({ token: refreshToken })
  }

  ctx.cookies.set('refreshToken', '', { maxAge: 0 })
  ctx.body = { message: 'Logged out' }
}

export const getMe = async (ctx: Context) => {
  try {
    const userId = ctx.state.user.id

    const user = await userService.findOneBy(userId)

    if (!user) {
      ctx.status = 404
      ctx.body = { message: 'User not found' }
      return
    }

    ctx.status = 200
    ctx.body = {
      user,
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      message: 'Error connecting to server',
    }
  }
}
