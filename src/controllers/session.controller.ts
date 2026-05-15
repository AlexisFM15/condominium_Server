import { Context } from 'koa'
import jwt from 'jsonwebtoken'
import { sessionService } from '../services/session.service.js'
import { accessToken } from '../libs/jwt.js'

const refreshToken = async (ctx: Context) => {
  //take refresh token from cookies
  const refreshToken = ctx.cookies.get('refreshToken')

  console.log('intento refresh', console.log(refreshToken))
  //validation token
  if (!refreshToken) {
    ctx.status = 401
    return
  }

  //search in db session by token
  const session = await sessionService.findOne({
    where: { token: refreshToken },
    relations: ['user'],
  })

  if (!session) {
    ctx.status = 401
    return
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.SECRET_KEY!)
    if (!payload) {
      ctx.status = 401
      return
    }
    const acToken = accessToken(session.user.id!)
    console.log(acToken)

    ctx.body = { accessToken: acToken }
  } catch (error) {
    ctx.status = 401
    console.log(error)
  }
}

export { refreshToken }
