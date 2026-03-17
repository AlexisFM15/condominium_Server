import { Context, Next } from 'koa'
import jwt from 'jsonwebtoken'

export const auth = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization

  if (!authHeader) {
    ctx.status = 401
    console.log('no existe')
    return
  }

  //extract token from header
  const token = authHeader.split('Bearer ')[1]

  try {
    //validations process
    const payload = jwt.verify(token!, process.env.SECRET_KEY!)
    ctx.state.user = payload
    await next()
  } catch (error) {
    ctx.status = 401
    console.log(error)
  }
}
