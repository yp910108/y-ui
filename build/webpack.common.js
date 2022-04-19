const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const config = require('./config')

module.exports = {
  mode: 'production',
  entry: {
    app: [path.join(__dirname, '../src/index.js')]
  },
  output: {
    path: path.join(__dirname, '../lib'),
    publicPath: '/dist',
    filename: 'y-ui.common.js',
    chunkFilename: '[id].js',
    library: 'YUI',
    libraryTarget: 'commonjs2',
    libraryExport: 'default'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: config.alias,
    modules: ['node_modules']
  },
  externals: config.externals,
  performance: {
    hints: false
  },
  stats: {
    children: false
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        exclude: config.jsexclude,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [new ProgressBarPlugin(), new VueLoaderPlugin()]
}
