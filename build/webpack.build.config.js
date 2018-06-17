const path = require('path');

module.exports = {
    entry: {
        app: ['./src/observer/index.js']
    },
    output: {
        filename: 'dom-template.js',
        library: 'VDom',
        libraryTarget: 'umd'
    },
    mode: 'none',
    module: {
        rules: [
            {
                test: /\.js$/,
                type: 'javascript/auto',
                exclude: [/node_modules/],
                use: ['babel-loader']
            }
        ]
    }
}