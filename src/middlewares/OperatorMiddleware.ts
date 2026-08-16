import { Context, Next } from 'koa'
import jwt from 'jsonwebtoken'
import { userService } from '../services/user.service.js'
import { Rol } from '../utils/enums.js'

export const Operador = async (ctx: Context, next: Next) => {
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
    const { userId } = ctx.state.user
    const user = await userService.findOne({
      where: { id: userId },
    })
    if (user?.role === Rol.CONDOMINIUM) {
      ctx.status = 401
      console.log('acceso denegado por rango')
      return
    }
    await next()
  } catch (error) {
    ctx.status = 401
    console.log(error)
  }
}
