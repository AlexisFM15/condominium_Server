import app from './app.js'
import 'dotenv/config'
import database from './config/database.js'

function Run() {
  app.listen(process.env.PORT, () => {
    console.log('server running port ', process.env.PORT)
  })
  database.initializeDB()
}

Run()
