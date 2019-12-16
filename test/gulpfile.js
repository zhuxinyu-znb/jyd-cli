const gulp = require('gulp');
const watch = require('gulp-watch');
const babel = require("gulp-babel");
const rollup = require("gulp-rollup");
const replace = require("rollup-plugin-replace");
const rename = require("gulp-rename");
const ts = require("gulp-typescript");
const tsConfig = ts.createProject("./src/server/tsconfig.json");
const entry = "./src/server/**/*.ts";
// const cleanEntry = ["./src/server/config/index.ts"];

// babel的配置项
const babelConfig = {
    presets: ["@babel/preset-typescript"],
    plugins: [
        [
            "@babel/plugin-proposal-decorators",
            {
                legacy: true
            }
        ],
        "@babel/plugin-transform-modules-commonjs"
    ]
};

/* // 开发环境
const buildDev = () => {
    return watch(entry, { ignoreInitial: false }, function () {
        gulp.src(entry).pipe(babel({
            // 不读取外面的babelrc配置，不需要编译成es5
            'babelrc': false,
            ...babelConfig
        }))
            .pipe(gulp.dest('dist'));
    })
}
 */


// 上线环境
const buildProd = () => {
    return gulp
        .src(entry)
        // .pipe(tsConfig())
        // .pipe(
        //     babel({
        //         babelrc: false,
        //         // ignore: cleanEntry,
        //         ...babelConfig
        //     })
        // )
        .pipe(gulp.dest("dist"));
}

//清洗环境
/* const buildConfig = () => {
    return gulp
        .src(entry)
        .pipe(
            rollup({
                output: {
                    file: "index.js",
                    format: "cjs"
                },
                plugins: [
                    replace({
                        "process.env.NODE_ENV": JSON.stringify("production")
                    })
                ],
                input: cleanEntry
            })
        )
        .pipe(
            rename(function (path) {
                path.extname = ".js";
            })
        )
        .pipe(gulp.dest("dist"));
} */

//对代码进行检查的环境
const buildLint = () => {

}

// let build = gulp.series(buildDev)
let build;

if (process.env.NODE_ENV == 'production') {
    build = gulp.series(buildProd);
}

if (process.env.NODE_ENV == 'lint') {
    build = gulp.series(buildLint);
}

gulp.task('default', build);