import * as Router from "koa-router";
import { route, GET } from "awilix-koa";
import { IApi } from "../interface/IApi";

@route("/api")
export default class ApiController {
  private apiService;
  constructor({ apiService }) {
    this.apiService = apiService;
  }
  @route("/test")
  @GET()
  private async test(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    const result: Promise<Object> = await this.apiService.getInfo(
      "https://api.github.com/users/github"
    );
    ctx.body = result;
  }
  @route("/num")
  @GET()
  private async test1(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    ctx.response.body = 222233332;
  }
}
