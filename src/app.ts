import 'reflect-metadata'
import koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import router from './routes/testingRoute.route.js'

const app = new koa()

app.use(cors())
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())


export default app
