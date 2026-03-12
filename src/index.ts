import 'dotenv/config'
import app from './app.js'
import database from './config/database.js'

function Run() {
  try {
    app.listen(process.env.PORT, () => {
      console.log('server running port ', process.env.PORT)
    })
    database.initializeDB()
  } catch (error) {
    console.log(error)
  }
}

Run()
