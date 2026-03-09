import { DataSource } from 'typeorm'

const appDataSource = new DataSource({
  type: 'postgres',
  database: '',
  host: '',
  port: 0,
  username: '',
  password: '',
  entities: [],
  migrations: ['src/migrations/*{.ts,.js}'],
})

const initializeDB = async () => {
  try {
    await appDataSource.initialize()
  } catch (error) {
    console.log('database is unavailable')
  }
}

export default { initializeDB, appDataSource }
