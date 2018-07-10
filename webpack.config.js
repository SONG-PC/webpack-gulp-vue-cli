var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: __dirname + "/app/main.js",//�Ѷ���ἰ��Ψһ����ļ�
    output: {
        path: __dirname + "/public",//�������ļ���ŵĵط�
        filename: "bundle[hash:8].js"//���������ļ����ļ���
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: "./public",//���ط����������ص�ҳ�����ڵ�Ŀ¼
        historyApiFallback: true,//����ת
        inline: true//ʵʱˢ��
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