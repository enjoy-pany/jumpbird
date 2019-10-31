const path = require('path');
const uglify = require('uglifyjs-webpack-plugin'); //js压缩插件
const htmlPlugin = require('html-webpack-plugin'); //html压缩插件
const extractPlugin = require('mini-css-extract-plugin'); //css分离插件
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 文件copy插件
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin'); // dist清理插件

module.exports = {
  entry: { //入口文件
    index1: "./src/Game.js",
    index2: "./src/Asset.js",
    index3: "./src/OverScene.js",
    index4: "./src/Bird.js",
    index5: "./src/Holdbacks.js"
  },
  output: { //出口文件
    path: path.resolve(__dirname, '../dist'), //打包文件夹
    filename: '[name].[hash:5].js', //打包文件名称
    publicPath: './'
  },
  mode: 'development', //模式选择
  module: { //转化配置
    rules: [
      //css loader
      {
        test: /\.css$/,
        use: [
          extractPlugin.loader,
          'css-loader'
        ]
      },
      //写在html中的image-loader
      {
        test: /\.html$/i,
        use: ['html-withimg-loader']
      },
      //image loader
      {
        test: /\.(jpg|jpeg|png|gif)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 500,
            publicPath: '../src/images/',
            outputPath: 'images/'
          }
        }]
      },
      //es6 转义
      {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: "/node_modules/" //include 表示哪些目录中的 .js 文件需要进行 babel-loader
                                  //exclude 表示哪些目录中的 .js 文件不要进行 babel-loader
      }
    ]
  },
  plugins: [ //插件
    new uglify(),
    new htmlPlugin({
      minify: { //对html进行压缩
        removeAttriuteQuotes: true //去掉属性的双引号
      },
      // inject: head,
      hash: false, //为了js有缓存效果，添加hash解除缓存效果
      template: './index.html' //要打包的html路径及文件名称
    }),
    new extractPlugin({
      filename: './[name].css',
      chunkFilename: '[id].css'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: 'images', to: 'images', }, // 顾名思义，from 配置来源，to 配置目标路径
      { from: 'js', to: 'js' }, // 配置项可以使用 glob
      // 可以配置很多项复制规则
    ]),
  ],
  loader: {}, //loader 转换器
  devServer: { //服务器配置
    contentBase: path.resolve(__dirname, '../dist/'), //设置目录的基本结构
    host: 'localhost', //服务器Ip地址
    port: '8089', //端口配置
    compress: true //服务器压缩是否开启
  }

}