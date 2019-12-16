import csshook from 'css-modules-require-hook';
import * as bodyParser from "koa-bodyparser";
const render = require("koa-swig");
import * as serve from "koa-static";
import co from "co";
import { configure, getLogger } from "log4js";
import { resolve } from "path";
import historyApiFallback from "koa2-connect-history-api-fallback";
const { createContainer, Lifetime, asClass } = require("awilix"); // IOC
const { loadControllers, scopePerRequest } = require("awilix-koa"); // IOC
const path = require('path')
import config from "../config";
import errorHandler from "./errorHandler";

// 初始化IOC容器
const initIOC = app => {
  // 创建IOC的容器
  const container = createContainer();
  // 每一次请求都是一个new model
  app.use(scopePerRequest(container));

  // 装载所有的service(models), 并将services代码注入到controllers
  container.loadModules(
    [
      resolve(__dirname, "../service/*.ts"),
      resolve(__dirname, "../util/SafeRequest.ts")
    ],
    {
      // we want `TodosService` to be registered as `todosService`.
      formatName: "camelCase",
      resolverOptions: {
        lifetime: Lifetime.SCOPED
      }
    }
  );
};

// 配置log
const initLog = app => {
  configure({
    appenders: {
      cheese: { type: "file", filename: resolve(__dirname, "../logs/yd.log") }
    },
    categories: { default: { appenders: ["cheese"], level: "error" } }
  });
  const logger = getLogger("cheese");

  app.context.logger = logger;

  // 错误处理
  errorHandler.error(app);
};

// 配置渲染
const initRender = app => {
  // 配置swig(前端模板)
  app.context.render = co.wrap(
    render({
      root: config.viewDir,
      autoescape: true,
      cache: "memory",
      ext: "html",
      varControls: ["[[", "]]"], // 默认动态数据是{{}}，但是为了与vue区分开来，改为[[xxx]]
      writeBody: false
    })
  );

  // 配置静态文件目录
  app.use(serve(config.staticDir));
};

// 配置路由
const initController = app => {
  // 注册所有路由
  app.use(
    loadControllers(resolve(__dirname, "../controller/*"), {
      cwd: __dirname
    })
  );
  app.use(historyApiFallback({ index: "/", whiteList: ["/api"] }));
};

export default function load(app) {
  app.use(bodyParser());

  initIOC(app);

  initLog(app);

  initController(app);

  initRender(app);
}
