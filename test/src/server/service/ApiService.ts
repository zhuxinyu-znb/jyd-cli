// import safeRequest from '../util/SafeRequest'
import { IApi } from '../interface/IApi'

export default class ApiService implements IApi {
  public safeRequest
  constructor({ safeRequest }) {
    this.safeRequest = safeRequest
  }

  public getInfo(url: string, arg?: Object, callback?: Function): Promise<Object> {
    return this.safeRequest.fetch(url, arg, callback)
  }
}
