// import * as Router from "koa-router";
// import { route, GET } from "awilix-koa";
// const ReactDomServer = require("react-dom/server");
// const serverEntry = require("../assets/server-entry.js").default;
// console.log("serverEntry", serverEntry);
// const { Readable } = require("stream");
// const LRU = require("lru-cache");

// const options = {
//   max: 500,
//   length: function(n, key) {
//     return n * 2 + key.length;
//   },
//   dispose: function(key, n) {
//     n.close();
//   },
//   maxAge: 1000 * 60 * 60
// };
// const cache = new LRU(options);

// @route("/:controller?")
// export default class IndexController {
//   private indexService: any;
//   constructor({ indexService }) {
//     this.indexService = indexService;
//   }
//   @route("/:action?")
//   @GET()
//   private async index(
//     ctx: Router.IRouterContext,
//     next: () => Promise<any>
//   ): Promise<any> {
//     /* const _controller = ctx.params.controller
//       ? `/${ctx.params.controller}`
//       : "/";
//     let result = await ctx.render("index");
//     const _cache = cache.get(_controller);
//     let appString = "";
//     if (_cache) {
//       appString = _cache;
//     } else {
//       appString = ReactDomServer.renderToString(serverEntry(_controller));
//       cache.set(_controller, appString);
//     }
//     result = result.replace("<App />", appString);
//     ctx.status = 200;
//     ctx.type = "html";
//     function createSsrStreamPromise() {
//       return new Promise((resolve, reject) => {
//         const stream = new Readable();
//         stream.push(result);
//         stream.push(null);
//         stream
//           .on("error", err => {
//             reject(err);
//           })
//           .pipe(ctx.res);
//       });
//     }
//     await createSsrStreamPromise(); */

//     // ctx.body = await ctx.render("index");
//   }
// }
