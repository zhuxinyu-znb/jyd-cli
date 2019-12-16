const { join, resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  target: "node",
  entry: {
    app: join(__dirname, "../src/client/index-server-entry.tsx")
  },
  output: {
    filename: "assets/server-entry.js",
    path: join(__dirname, '../dist'),
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        include: [resolve("src")],
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [resolve("src")],
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    alias: {
      "@assets": resolve("src/client/assets"),
      "@components": resolve("src/client/components"),
      "@models": resolve("src/client/models"),
      "@pages": resolve("src/client/pages"),
      "@utils": resolve("src/client/utils")
    },
    modules: ["node_modules", resolve("src")],
    extensions: [".js", ".ts", ".tsx", "jsx"]
  },
  // 服务端渲染把相关的依赖都去掉
  // 也可以这样写 const nodeExternals = require('webpack-node-externals')
  //   externals: [nodeExternals].
  //   externals: Object.keys(require('./package.json').dependencies),
  devServer: {
    compress: true,
    port: '3000',
    contentBase: join(__dirname, '../dist'),
    disableHostCheck: true,
    historyApiFallback: true,
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './src/web/index-dev.html',
    //   filename: 'index.html'
    // })
  ],
}