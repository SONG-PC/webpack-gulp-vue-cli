var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: __dirname + "/app/main.js",//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/public",//打包后的文件存放的地方
        filename: "bundle[hash:8].js"//打包后输出文件的文件名
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: "./public",//本地服务器所加载的页面所在的目录
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: __dirname + '/public/index.html',
            inject: 'head',
            template: __dirname + '/app/index.html',
            inlineSource: '.(js|css)$'
        })

    ],
  module: {
 rules: [
        {
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env',{
                            targets: {
                                browsers: ['> 1%', 'last 2 versions']
                            }
                        }]
                    ]
                }
            },
            exclude: '/node_modules/'
        } , {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.(png|jsp|gif|jpg)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 500,
                        name:'images/[hash:8].[name].[ext]'
                    }
                }]
            }
       
      ]
}
};