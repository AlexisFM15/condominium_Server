import { Context } from 'koa'
import { getDashboard } from '../services/dashboard.service.js'

export const getDashboardA = async (ctx: Context) => {
  try {
    const userId = ctx.state.user.userId
    console.log('das', userId)
    const dashboard = await getDashboard(userId)

    ctx.status = 200
    ctx.body = dashboard
  } catch (error) {
    ctx.status = 500
    console.log(error)
    ctx.body = {
      message: 'Server error',
    }
  }
}
