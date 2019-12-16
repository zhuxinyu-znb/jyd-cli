import User from '../model/User'

export interface IIdex {
  getUser(id: string): User
}
