import * as Router from "koa-router";
import { route, GET } from "awilix-koa";
const ReactDomServer = require('react-dom/server');
const serverEntry = require('../assets/server-entry.js').default;

@route("/report")
export default class LoginController {
  @GET()
  private async index(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    // ctx.body = 111;
    const appString = ReactDomServer.renderToString(serverEntry('/report'));
    console.log('服务端渲染的')
    let result = await ctx.render("index");
    ctx.body = result.replace('<div id=app></div>', appString);
  }
}
