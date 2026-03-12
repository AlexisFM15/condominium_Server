import Router from "@koa/router";
import { login } from "../controllers/auth.controller.js";

const router = new Router()

router.post('/login', login)
router.get('/profile')
router.post('/logout')

export default router