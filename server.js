var util = require('util')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var webpackDev = require('webpack-dev-middleware')
var webpackHot = require('webpack-hot-middleware')
var config = require('./webpack.config')

var server = express()
var compiler = webpack(config)

var host = 'localhost'
var port = 3000
var url = util.format('http://%s:%d', host, port)

server.use(webpackDev(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}))

server.use(webpackHot(compiler, {
  noInfo: true,
}))

server.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app', 'index.html'))
})

server.listen(port, host, function(err) {
  if (err) {
    console.log(err)
    return
  }

  console.log(util.format('Listening at %s', url))
})
