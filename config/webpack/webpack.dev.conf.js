const webpack = require('webpack');//引入webpack
const opn = require('opn');//打开浏览器
const merge = require('webpack-merge');//webpack配置文件合并
const path = require("path");
const baseWebpackConfig = require("./webpack.base.conf");//基础配置
const webpackFile = require("./webpack.file.conf");//一些路径配置
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const entry = require("./webpack.entry.conf");
const webpackCom = require("./webpack.com.conf");

let config = merge(baseWebpackConfig, {
    /*设置开发环境*/
    mode: 'development',
    output: {
        path: path.resolve(webpackFile.devDirectory),
        filename: 'js/[name].js',
        chunkFilename: "js/[name].js",
        publicPath: ''
    },
    optimization: {
        // 包清单
        runtimeChunk: {
            name: "manifest"
        },
        //拆分公共包
        splitChunks: {
            cacheGroups: {
                //项目公共组件
                common: {
                    chunks: "initial",
                    name: "common",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                //第三方组件
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../env/dev')
        }),
        /*设置热更新*/
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    'cache-loader',
                    'babel-loader'
                    // {
                    //     loader: "babel-loader",
                    //     options: {
                    //         presets: ['es2015', 'react'],
                    //         plugins: [
                    //             ["import", {"libraryName": "antd", "libraryDirectory": "es", "style": "css"}] // `style: true` 会加载 less 文件
                    //         ]
                    //     }
                    // }
                ],
                include: [
                    path.resolve(__dirname, "../../app"),
                    path.resolve(__dirname, "../../entryBuild")
                ],
                exclude: [
                    path.resolve(__dirname, "../../node_modules")
                ],
            },
            {
                test: /\.(css|pcss)$/,
                loader: 'style-loader?sourceMap!css-loader?sourceMap!postcss-loader?sourceMap'
                // exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|ttf|eot|woff|woff2|svg|swf)$/,
                loader: 'file-loader?name=[name].[ext]&outputPath=' + webpackFile.resource + '/'
            }
        ]
    },
    /*设置api转发*/
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        hot: true,
        inline: true,
        contentBase: path.resolve(webpackFile.devDirectory),
        historyApiFallback: true,
        disableHostCheck: true,
        proxy: [
            {
                context: ['/api/**', '/u/**'],
                target: 'http://192.168.12.100:8080/',
                secure: false
            }
        ],
        /*打开浏览器 并打开本项目网址*/
        after() {
            opn('http://localhost:' + this.port);
        }
    }
});

let pages = entry;
for (let chunkName in pages) {
    let conf = {
        filename: chunkName + '.html',
        template: 'index.html',
        inject: true,
        title: webpackCom.titleFun(chunkName, pages[chunkName][1]),
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        chunks: ['manifest', 'vendor', 'common', chunkName],
        hash: false,
        chunksSortMode: 'dependency'
    };
    config.plugins.push(new HtmlWebpackPlugin(conf));
}
/* 清除 dist */

// config.plugins.push(new CleanWebpackPlugin([webpackFile.devDirectory], {
//     root: path.resolve(__dirname, '../../'),
//     verbose: true,
//     dry: false
// }));

let copyObj = [
    {from: './app/public/plugin', to: './plugin'},//一些不需要走webpack的插件
    // {from: './app/public/versionTips', to: './versionTips'},//固定不变的浏览器版本提示文件
    {from: './app/public/file', to: './resource'},//一些固定的文件，如下载文件
    {from: './app/public/img/favicon.ico', to: './'},//网站favicon.ico
];

let copyArr = [];
copyObj.map((data) => {
    copyArr.push(
        new CopyWebpackPlugin([{from: data.from, to: data.to, ignore: ['.*']}])
    )
});

/* 拷贝静态资源  */
copyArr.map(function (data) {
    return config.plugins.push(data)
});

module.exports = config;