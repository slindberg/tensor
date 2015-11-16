var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

function dir(name) {
  return path.join(__dirname, name)
}

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/main',
  ],
  output: {
    path: dir('dist'),
    filename: 'assets/application.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('assets/styles.css'),
    new HtmlWebpackPlugin({ template: 'app/index.html' }),
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
