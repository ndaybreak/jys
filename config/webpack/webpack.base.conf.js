'use strict'
const path = require('path')
function resolve (dir) {
    return path.join(__dirname, '../..', dir)
}

const entry = require("./webpack.entry.conf");
const newEntry = {};
for (let name in entry) {
    newEntry[name] = entry[name][0]
}
let config = {
    entry: newEntry,
    // 配置模块如何解析
    resolve: {
        //自动解析指定的扩展,能够使用户在引入模块时不带扩展
        extensions: [".js", ".json", ".jsx", ".css", ".pcss"],
        alias: {'@': resolve('app')}
    }
};
module.exports = config;