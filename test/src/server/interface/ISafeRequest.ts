export interface ISafeRequest {
  fetch(url: string, arg?: Object, callback?: Function): Promise<Object>
}
