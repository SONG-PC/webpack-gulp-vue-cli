//html�ļ�ģ�����
var HtmlWebpackPlugin = require('html-webpack-plugin');
//�������Է�������
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//��ȡ�����ļ�����Ϣ
var glob = require('glob');
//����css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var webpackConfig = {
    entry:   //�����ʱ   __dirname + "/app/main.js"
    {
      //�����Ϊ����,�˴�ʹ�ö�̬����,���139��
       
    },
    output: {
        path: __dirname + "/public/",
        //�������ļ���ŵĵط�
        filename: "bundle[hash:8].[name].js",
        //���������ļ�����������
        chunkFilename: '[name].[hash:8].js' //�ְ��ļ�����������
    },
    optimization: {
        //�ְ����� ,�粻���ô�����,��ͬһ����������ļ���
        splitChunks: {
            cacheGroups: {
                //�ְ�1
                vendor: {
                    chunks: "all",
                    //�ְ���ʽ initial(��ʼ��)��async(������ؿ�)��all(ȫ����)��Ĭ��Ϊall;
                    test: /[\\/] node_modules[\\ / ] /,
                    //node_modules�ڵ�������
                    name: "lib/vendor",
                    //�ְ�����
                    minChunks: 1,
                    //����ͬentry���ô���(import),>=������ְ�,��������ڳ����ļ���
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 100,
                    enforce: false
                },
                //�ְ�2
                common: { 
                    chunks: "all",
                    test: /\jq.js|.css$/,                
                    name: "lib/common",                 
                    minChunks: 1,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 100,
                    enforce: false
                }
                //�ְ�N....
            }
        }
    },
    devtool: 'cheap-source-map',
    //Դ��ӳ��,��JS���г���ʱ���㶨λ��Դ������Ǵ�����ѹ���ļ�
    //webpack���ط���������
    devServer: {
        contentBase: "./public",
        //���ط����������ص�ҳ�����ڵ�Ŀ¼
        historyApiFallback: true,
        //����ת
        inline: true //ʵʱˢ��
    },
    //webpack���ò��
    plugins: [
        //webpack ������ļ�,��ģ������, HtmlWebpackPlugin���Զ���������
        //new HtmlWebpackPlugin({
        //    filename: __dirname + '/public/index.html',
        //    inject: true ,
        //    template: __dirname + '/app/index.html',
        //    inlineSource: '.(js|css)$'
        //})//,    
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].[hash].css"
        }), new BundleAnalyzerPlugin()],
    //loader ������Ԥ����,������ļ������ص�ģ��(��ʽ,JS,ͼƬ,��)���д���
    //webpack һ����Դ��ģ��
    module: {
        rules: [
            //����JS��ͷ�ļ�����es6->es5ת��
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['env', {
                            targets: {
                                browsers: ['> 1%', 'last 2 versions']
                            }
                        }]]
                    }
                },
                //������/node_modules/��js�ļ�
                exclude: '/node_modules/'
            },
            {

                //���css�ļ�
                test: /\.css$/,
                // use: ['style-loader', 'css-loader'] --css���������js�ļ�����
                //--����css�ļ�����
                use: [{
                    loader: MiniCssExtractPlugin.loader,

                },
                    "css-loader"]

            },
            //���ͼƬ�ļ�
            {
                test: /\.(png|jsp|gif|jpg)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 500,
                        //С�ڵ���500 bytes �����base64,�����ڳ���js�ļ���
                        name: 'images/[hash:8].[name].[ext]'
                    }
                }]
            },
            //scssתcss
            {
                test: /\.scss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                },
                    "css-loader", "sass-loader"]
            }

        ]
    }
};
//���������,���� app/entries/**�����ļ�����main.js ����ļ�
getEntries('app/entries/**/main.js');
function getEntries(globPath) {

    var files = glob.sync(globPath),
        entries = {};

    files.forEach(function (filepath) {
        // ȡ�����ڶ���(view������ļ���)������
        var split = filepath.split('/');
        var name = split[split.length - 2];
        entries[name] = [];
        entries[name].push(__dirname + '/' + filepath);
        chunks: [name]
    });

    Object.keys(entries).forEach(function (name) {
        // ÿ��ҳ������һ��entry�������ҪHotUpdate���������޸�entry
        webpackConfig.entry[name] = entries[name];

        // ÿ��ҳ������һ��html
        var plugin = new HtmlWebpackPlugin({
            // ���ɳ�����html�ļ���
            filename: __dirname + '/public/' + name + '/' + name + '.html',
            // ÿ��html��ģ�棬������ҳ��ʹ��ͬһ��ģ��
            template: __dirname + '/app/index.html',
            // �Զ������ò���html
            inject: true,
            //���طְ��ͳ��ڰ�
            chunks: ['lib/vendor', 'lib/common', name]
        });
        //����webpackִ�в��
        webpackConfig.plugins.push(plugin);

    });
}

module.exports = webpackConfig;