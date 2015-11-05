var path = require('path')
var webpack = require('webpack')

function dir(name) {
  return path.join(__dirname, name)
}

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/index',
  ],
  output: {
    path: dir('dist'),
    filename: 'application.js',
    publicPath: '/assets/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        include: dir('app'),
      },
      {
        test: /\.scss$/,
        loaders: [ 'style', 'css?modules&sourceMap', 'sass?sourceMap' ],
      },
    ],
  },
  resolve: {
    extensions: [ '', '.js', '.scss' ],
  },
}
