import { Context } from 'koa'
import { Login, User } from '../types.js'
import { userService } from '../services/user.service.js'
import { IncorrectPassword, UserNotFound } from '../utils/errors.js'
import { validatePassword } from '../libs/bcrypt.js'

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
    ctx.status = 200
    ctx.body = { message: 'Access succeed' }
    return
  } catch (error) {
    if (error instanceof UserNotFound) {
      ctx.status = error.statusCode
      ctx.body = { message: error.message }
      return
    }

    if (error instanceof IncorrectPassword) {
      ctx.status = error.statusCode
      ctx.body = { message: error.message }
      return
    }

    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
    console.log(error)
  }
}
