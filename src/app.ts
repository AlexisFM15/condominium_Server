import 'reflect-metadata'
import koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import router from './routes/index.routes.js'

const app = new koa()

const allowedOrigins = [
  'http://localhost:5173',
  'https://app.mateogenao.com',
]

app.use(
  cors({
    origin: (ctx) => {
      const requestOrigin = ctx.get('Origin')

      if (allowedOrigins.includes(requestOrigin)) {
        return requestOrigin
      }

      return ''
    },
    credentials: true,
  }),
)

app.use(bodyParser())

app.use(async (ctx, next) => {
  console.log(`${ctx.method} ${ctx.url}`)
  await next()
})

// routes config
app.use(router.routes())
app.use(router.allowedMethods())

export default app