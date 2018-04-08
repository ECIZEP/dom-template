const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: ['./src/index.js', 'webpack-hot-middleware/client?path=/__what&timeout=2000&overlay=false']
    },
    output: {
        publicPath: '/',
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
    },
    plugins: [
        new htmlWebpackPlugin({
            template: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}