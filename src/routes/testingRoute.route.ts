import Router from '@koa/router'

const router = new Router()

router.get('/' , (ctx)=>{
    ctx.body = 'si funciona'
    console.log('aprobed')
})

export default router