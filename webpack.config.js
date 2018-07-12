//html文件模板加载
var HtmlWebpackPlugin = require('html-webpack-plugin');
//包依赖性分析工具
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//获取本地文件夹信息
var glob = require('glob');
//分离css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var webpackConfig = {
    entry:   //单入口时   __dirname + "/app/main.js"
    {
      //多入口为对象,此处使用动态加载,详见139行
       
    },
    output: {
        path: __dirname + "/public/",
        //打包后的文件存放的地方
        filename: "bundle[hash:8].[name].js",
        //打包后输出文件的命名策略
        chunkFilename: '[name].[hash:8].js' //分包文件的命名策略
    },
    optimization: {
        //分包配置 ,如不启用此配置,则同一打包进出口文件中
        splitChunks: {
            cacheGroups: {
                //分包1
                vendor: {
                    chunks: "all",
                    //分包方式 initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
                    test: /[\\/] node_modules[\\ / ] /,
                    //node_modules内的依赖库
                    name: "lib/vendor",
                    //分包名称
                    minChunks: 1,
                    //被不同entry引用次数(import),>=配置则分包,否则包含在出口文件中
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 100,
                    enforce: false
                },
                //分包2
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
                //分包N....
            }
        }
    },
    devtool: 'cheap-source-map',
    //源码映射,当JS运行出错时方便定位到源码而不是打包后的压缩文件
    //webpack本地服务器配置
    devServer: {
        contentBase: "./public",
        //本地服务器所加载的页面所在的目录
        historyApiFallback: true,
        //不跳转
        inline: true //实时刷新
    },
    //webpack所用插件
    plugins: [
        //webpack 单入口文件,单模板配置, HtmlWebpackPlugin会自动生成引用
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
    //loader 加载器预处理,对入口文件所加载的模块(样式,JS,图片,等)进行处理
    //webpack 一切资源即模块
    module: {
        rules: [
            //所有JS开头文件进行es6->es5转码
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
                //不包括/node_modules/下js文件
                exclude: '/node_modules/'
            },
            {

                //打包css文件
                test: /\.css$/,
                // use: ['style-loader', 'css-loader'] --css打包进出口js文件配置
                //--分离css文件配置
                use: [{
                    loader: MiniCssExtractPlugin.loader,

                },
                    "css-loader"]

            },
            //打包图片文件
            {
                test: /\.(png|jsp|gif|jpg)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 500,
                        //小于等于500 bytes 打包成base64,放置在出口js文件中
                        name: 'images/[hash:8].[name].[ext]'
                    }
                }]
            },
            //scss转css
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
//多入口配置,遍历 app/entries/**任意文件夹下main.js 入口文件
getEntries('app/entries/**/main.js');
function getEntries(globPath) {

    var files = glob.sync(globPath),
        entries = {};

    files.forEach(function (filepath) {
        // 取倒数第二层(view下面的文件夹)做包名
        var split = filepath.split('/');
        var name = split[split.length - 2];
        entries[name] = [];
        entries[name].push(__dirname + '/' + filepath);
        chunks: [name]
    });

    Object.keys(entries).forEach(function (name) {
        // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
        webpackConfig.entry[name] = entries[name];

        // 每个页面生成一个html
        var plugin = new HtmlWebpackPlugin({
            // 生成出来的html文件名
            filename: __dirname + '/public/' + name + '/' + name + '.html',
            // 每个html的模版，这里多个页面使用同一个模版
            template: __dirname + '/app/index.html',
            // 自动将引用插入html
            inject: true,
            //加载分包和出口包
            chunks: ['lib/vendor', 'lib/common', name]
        });
        //插入webpack执行插件
        webpackConfig.plugins.push(plugin);

    });
}

module.exports = webpackConfig;