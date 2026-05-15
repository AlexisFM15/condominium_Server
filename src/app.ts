import 'reflect-metadata'
import koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import router from './routes/index.routes.js'

const app = new koa()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(bodyParser())

//routes config
app.use(router.routes())
app.use(router.allowedMethods())

export default app
