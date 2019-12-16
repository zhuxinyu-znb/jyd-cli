module.exports = {
    plugins: {
        'postcss-preset-env': {
            "browserslist": [
                "> 1%",
                "ie 9",
                "last 2 versions"
            ],
            stage: 0,
            features: {
                'nesting-rules': true,
                'autoprefixer': { grid: true }
            }
        }
    }
}
