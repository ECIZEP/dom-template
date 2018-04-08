const webpack = require('webpack');
const express = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const config = require('./build/webpack.dev.config');

const app = express();

let compiler = webpack(config);

app.use(devMiddleware(compiler, {
    publicPath: '/',
    quiet: true
}))

app.use(hotMiddleware(compiler, {
    path: '/__what',
    heartbeat: 2000
}))

app.listen(3033, () => console.log('server is running at port 3033'))

