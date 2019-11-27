const fs = require('fs')
const parh = require('path')
const webpack = require('webpack')

module.exports = {

  mode: 'development',

  /**
   * 我们会在 examples 目录下建多个子目录
   * 我们会把不同章节的 demo 放到不同的子目录中
   * 每个子目录的下会创建一个 app.ts
   * app.ts 作为 webpack 构建的入口文件
   * entries 收集了多目录个入口文件，并且每个入口还引入了一个用于热更新的文件
   * entries 是一个对象，key 为目录名
   */
  entry: fs.readdirSync(__dirname).reduce((entires,dir) => {
    const fullDir = parh.join(__dirname,dir)
    const entry = parh.join(fullDir,'app.ts')
    if(fs.statSync(fullDir).isDirectory() && fs.existsSync(entires)){
      entires[dir] = ['webpack-hot-middleware', entry]
    }

    return entires
  },{}),

  /**
   * 根据不同的目录名称，打包生成目标 js，名称和目录名一致
   */

  output: {
    path: parh.join(__dirname, '__build__'),
    filename: '[name].js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader'
          }
        ]
      },
      {
        test: /\.tsx$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]

}