import 'dotenv/config'
import app from './app.js'
import database from './config/database.js'

async function run() {
  try {
    await database.initializeDB()

    app.listen(process.env.PORT, () => {
      console.log('Server running on port', process.env.PORT)
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

run()