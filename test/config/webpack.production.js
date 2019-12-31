const WebpackBuildNotifierPlugin = require('webpack-build-notifier');/* **************** 开启通知面板 */
const HtmlWebpackPlugin = require('html-webpack-plugin');/* **************************** 插入html*/
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');/**************** 开启多核打包 */
const os = require('os');/* ************************************************************ 调用os */
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');/* ******* 压缩css */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;/* 打包后进行分析 */
const { resolve } = require('path');


module.exports = {
    /* optimization: {
        splitChunks: {
            chunks: 'all', // 如果选择async，则webpack只对异步引入的文件进行代码分割。选择all后则对同时对同步异步进行分割，在对同步代码进行分割的时候，还需要再对cacheGroups进行配置。
            minSize: 30000, // 当模块大于30000时才进行代码分割，小于的话就不进行分割
            maxSize: 0, // 通常不用
            minChunks: 1, // 当文件被用 1 次后进行代码分割
            maxAsyncRequests: 5, // 同时被加载到模块数最多是 5 个
            maxInitialRequests: 3, // 入口文件最多做三个代码分割
            automaticNameDelimiter: '~',// 通过~做连接符
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: { //缓存组。打包的时候先把所有遇见的模块放在缓存组中，遇到node_modules中的模块放在vendors组中，遇到其他模块放在default组中，在最后一起进行打包
              vendors: {
                test: /[\\/]node_modules[\\/]/,// 当chunks选择all时，执行同步代码分割的话，会先走到这里，对其进行检测是否是node_modules下的库，如果是的话，就将其打包到vendors里，这时我们可以看到打包出来的文件是vendors~lodash.bundle.js
                priority: -10 //值越大优先级越高
              },
              default: {
                // 如果引入的是自定义的文件，而不是node_modules下的文件，此时将会进入default组内
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true // 如果打包的时候发现一个模块已经被引用打包过了，那么就不再对其进行打包
              }
            }
        }
    }, */
    optimization: {
        minimize: true,
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            chunks: 'all', // 如果选择async，则webpack只对异步引入的文件进行代码分割。选择all后则对同时对同步异步进行分割，在对同步代码进行分割的时候，还需要再对cacheGroups进行配置。
            minSize: 30000, // 当模块大于30000时才进行代码分割，小于的话就不进行分割
            maxSize: 0, // 通常不用
            minChunks: 1, // 当文件被用 1 次后进行代码分割
            maxAsyncRequests: 5, // 同时被加载到模块数最多是 5 个
            maxInitialRequests: 3, // 入口文件最多做三个代码分割
            automaticNameDelimiter: '~',// 通过~做连接符
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: { //缓存组。打包的时候先把所有遇见的模块放在缓存组中，遇到node_modules中的模块放在vendors组中，遇到其他模块放在default组中，在最后一起进行打包
              vendors: {
                test: /[\\/]node_modules[\\/]/,// 当chunks选择all时，执行同步代码分割的话，会先走到这里，对其进行检测是否是node_modules下的库，如果是的话，就将其打包到vendors里，这时我们可以看到打包出来的文件是vendors~lodash.bundle.js
                priority: -10 //值越大优先级越高
              },
              default: {
                // 如果引入的是自定义的文件，而不是node_modules下的文件，此时将会进入default组内
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true // 如果打包的时候发现一个模块已经被引用打包过了，那么就不再对其进行打包
              }
            }
        }
        /* splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false,
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    name: "commons"
                },
                // 合并所有css
                // styles: {
                //   name: 'style',
                //   test: /\.(css|scss)$/,
                //   chunks: 'all',
                //   minChunks: 1,
                //   enforce: true
                // }
            }
        } */
    },
    plugins: [
        new OptimizeCSSAssetsPlugin({}),
        new HtmlWebpackPlugin({
            title: 'CRM系统',
            filename: 'index.html',
            template: resolve(__dirname, '../src/client/index-prod.html'),
            minify: {
                minifyJS: true,
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        new WebpackBuildNotifierPlugin({
            title: '我的webpack',  // 可以起一个项目名字
            // logo: path.resolve('./img/favicon.png'),  // 可以找一个好看的小图标
            suppressSuccess: true // 显示成功
        }),
        new ParallelUglifyPlugin({
            exclude: /\.min\.js$/,
            workerCount: os.cpus().length,
            /* uglifyJS: {

            }, */
            uglifyES: {
                output: {
                    beautify: false,
                    comments: false,
                },
                compress: {
                    warnings: false,
                    drop_console: true,
                    collapse_vars: true
                }
            }
        }),
        new BundleAnalyzerPlugin(
            {
                analyzerMode: 'server',
                analyzerHost: '127.0.0.1',
                analyzerPort: 8889,
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: true,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info'
            }
        ),
    ]
}