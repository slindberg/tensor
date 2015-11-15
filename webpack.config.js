var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

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
    new ExtractTextPlugin('styles.css'),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        include: [ dir('app'), /node_modules\/react-.*/ ],
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', [ 'css?modules&sourceMap', 'sass?sourceMap' ]),
      },
    ],
  },
  resolve: {
    extensions: [ '', '.js', '.scss' ],
  },
}
