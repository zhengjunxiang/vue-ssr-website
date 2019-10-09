const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const resolve = dir => path.join(__dirname, '../', dir)
const isProd = process.env.NODE_ENV === 'production'
const urlLoaders = [{
  loader: 'url-loader',
  options: {
    limit: 10000,
    name: 'img/[name].[hash:8].[ext]?'
  }
}];

const base = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'nosources-source-map' : 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    chunkFilename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js'
  },
  resolve: {
    modules: [path.resolve(__dirname, '../node_modules')],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'public': path.resolve(__dirname, '../public'),
      'src': path.resolve(__dirname, '../src')
    }
  },
  performance: {
    maxAssetSize: 200000,
    hints: false
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /iview.src.*?js$/,
        loader: 'babel-loader?cacheDirectory=true',
        include: [resolve('node_modules')]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        exclude: file => (
          /node_modules/.test(file) && !/\.vue\.js/.test(file)
        ),
        include: resolve('src')
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: urlLoaders
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:8].[ext]?'
        }
      }
    ]
  },
  plugins: (() => {
    const base = [
      new VueLoaderPlugin(),
      new CopyWebpackPlugin([{
        from: path.join(__dirname, '../public/robots.txt'),
        to: path.join(__dirname, '../dist/robots.txt'),
        ignore: ['.*', 'index.html']
      }])
    ]
    const dev = [new FriendlyErrorsPlugin()]
    const prod = []
    return base.concat(isProd ? prod : dev)
  })()
}

// 查看打包内容
if (process.env.analyz_config_report) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    base.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = base;
