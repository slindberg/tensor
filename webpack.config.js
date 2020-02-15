const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const distDir = path.resolve(process.cwd(), 'dist')

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development'

  const config = {
    entry: [
      './app/main',
    ],
    output: {
      path: distDir,
      filename: 'assets/application.js',
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({ filename: 'assets/styles.css' }),
      new HtmlWebpackPlugin({ template: 'app/index.html' }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: isDev,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [ '.js', '.scss' ],
    },
  }

  if (isDev) {
    config.entry.unshift('react-hot-loader/patch')
    config.devtool = 'source-map'
    config.devServer = {
      contentBase: distDir,
      port: 3000,
    }
  }

  return config
}
