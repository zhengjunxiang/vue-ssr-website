const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const WorkboxPlugin = require('workbox-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'

const config = merge(base, {
  entry: {
    app: './src/entry-client.js'
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          "postcss-loader",
          'less-loader'
        ]
      }
    ]
  },
  optimization: {
    moduleIds: 'hashed',
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: isProd // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.VUE_ENV': '"client"' }),
    new VueSSRClientPlugin()
  ]
})

if (process.env.NODE_ENV === 'production') {
  // config.plugins.push(
    // new WorkboxPlugin.GenerateSW({
    //   cacheId: 'webpack-pwa', // 设置前缀
    //   skipWaiting: true, // 强制等待中的 Service Worker 被激活
    //   clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
    //   swDest: 'service-worker.js', // 输出 Service worker 文件
    //   globPatterns: ['**/*.{html,js,css,png.jpg}'], // 匹配的文件
    //   globIgnores: ['service-worker.js', '**/*.map', '**/*.json'], // 忽略的文件
    //   runtimeCaching: [
    //     { // 配置路由请求缓存
    //       urlPattern: /.*\.js/, // 匹配文件
    //       handler: 'networkFirst' // 网络优先
    //     }
    //   ]
    // })
  // )
}

if (isProd) {
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'style/[name].[chunkhash:8].css',
      chunkFilename: 'style/[name].[chunkhash:8].css'
    })
  )
}

module.exports = config
