# 开发进度

## 完成开发环境 webpack 配置

1. webpack 配置文件分 development 和 production 进行配置
2. 对样式(css|less|postcss)、js(tsx|ts|jsx|js)、图片进行了loader配置。其中js使用babel-loader。
3. 添加了 html-webpack-plugin 和 clean-webpack-plugin 进行html的插入清除
4. 添加了一些花里花哨的插件：
    + progress-bar-webpack-plugin
    + speed-measure-webpack-plugin
    + friendly-errors-webpack-plugin
    + webpack-build-notifier
5. 添加了 webpack-manifest-plugin 做映射缓存
6. 在上线环境添加了css压缩 optimize-css-assets-webpack-plugin 和多核打包  webpack-parallel-uglify-plugin
7. 对不同环境的output进行了配置，上线添加md5加密
8. 配置了 optimization，但玩的不是太明白


## 完成路由添加

+ 通过添加路由表自动添加路由。
+ 使用 lazy 懒加载。
+ 可以点击切换页面。

## 完成几个基本页面

+ 写了几个简单的基本页。
+ 配置了antd 按需加载。
+ 准备使用 hooks + mobx-react-lite 进行逻辑开发，实现登录判断进行跳转。


优化

1. code-spliting + 异步路由

提取公共包和业务包
js.css图片
压缩混淆

home.tsx -> home.css
index.tsx -> index.css

提取css时，合并成一个css -> main.css

2. 按需加载，通过分析工具，查看依赖
或生成stats.json在网站上分析