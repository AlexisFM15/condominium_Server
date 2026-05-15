import database from '../config/database.js'
import { User } from '../models/user.model.js'

export const userService = database.appDataSource.getRepository(User).extend({
  findByEmail(email: string) {
    return this.createQueryBuilder('User')
      .where('User.email = :email', { email })
      .getRawOne()
  },
  getProfile(id: string) {
    return this.createQueryBuilder('User')
      .where('User.id = :id', { id })
      .getRawOne()
  },
  getDashboard() {},
})
