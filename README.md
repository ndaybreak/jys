--app    主目录

          --component    react组件目录

                  --index    首页目录

          --public    公共目录 主要放 js css img

                 --js    公共js文件

                 --css  css目录

                --img   图片目录

--devBuild    webpack 开发环境下 打包输出目录

--config    打包配置目录

       --webpack    webpack配置目录

--entryBuild    webpack 打包入口文件目录


"scripts": {
    "dev": "npm run devBuild && webpack-dev-server --devtool eval --progress --colors --profile --config config/webpack/webpack.dev.conf.js",
    // 创建入口文件
    "devBuildEntry": "node config/entry/entryBuild.js",
    // 创建html
    "devBuildHtml": "node config/html/htmlBuild.js",
    "devBuild": "npm run devBuildEntry && npm run devBuildHtml",
    "pro": "SET BABEL_ENV=production && webpack --progress --colors --config config/webpack/webpack.prod.conf.js",
    "ptp": "npm run pro && gulp buildTime zip test pre",
    "test": "echo \"Error: no test specified\" && exit 1"
  },