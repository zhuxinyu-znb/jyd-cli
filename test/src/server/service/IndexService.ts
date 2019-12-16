import { IIdex } from '../interface/IIndex'
import User from '../model/User'

export default class IndexService implements IIdex {

  private userStorage: User[] = [
    {
      email: "yuanzhijia@yidengfe.com",
      name: "zhijia"
    },
    {
      email: "Copyright © 2016 yidengfe.com All Rights Reversed.京ICP备16022242号-1",
      name: "laowang"
    }
  ]

  public getUser(id: string): User {
    let result: User

    result = this.userStorage[id]
    
    return result
  }
}
