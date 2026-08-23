import { Context } from 'koa'
import { Login, User } from '../types.js'
import { userService } from '../services/user.service.js'
import { validatePassword } from '../libs/bcrypt.js'
import { accessToken, refreshToken } from '../libs/jwt.js'
import { sessionService } from '../services/session.service.js'

export const login = async (ctx: Context) => {
  const { email, password } = ctx.request.body as Login
  try {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await userService.findByEmail(normalizedEmail)

       

    if (!user) {
      ctx.status = 400
      ctx.body = { message:'Credenciales incorrectas', data: []}
      return 
    }

    

    const passwordValidation = await validatePassword(
      password,
      user.User_password,
    )

    if (!passwordValidation) {
      ctx.status = 400
      ctx.body = { message:'Credenciales incorrectas', data: []}
      return 
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
console.log(user)
    ctx.cookies.set('refreshToken', rhToken)
    ctx.status = 200
    ctx.status = 200
ctx.body = {
  message: 'Access succeed',
  data: {
    accessToken: acToken,
    user: {
      id: user.User_id,
      email: user.User_email,
      role: user.User_role,
      defaultPassword: user.User_defaultPassword,
    },
  },
}
    return
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Error to conect to the server' }
  }
}

export const logout = async (ctx: Context) => {
  const refreshToken = ctx.cookies.get('refreshToken')
  const userId = ctx.state.user
  try {
    if (refreshToken) {
      const out = await sessionService.delete({ token: refreshToken })
    }
    ctx.cookies.set('refreshToken', '', { maxAge: 0 })
    ctx.body = { message: 'Logged out' }
  } catch (error) {
    console.log(error)
  }
}

export const getMe = async (ctx: Context) => {
  try {
    const userId = ctx.state.user.userId

    console.log('aqui', userId)
    
    const user = await userService.findOneBy({id: userId})

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
