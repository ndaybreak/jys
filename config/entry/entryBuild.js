const fs = require("fs");
const path = require("path");
const entry = require('./entry');
const rimraf = require('rimraf');

//定义entryBuild,生成的entry文件存放的位置
const entryBuildPath = path.resolve(__dirname, '../../entryBuild');
//删除entryBuild
rimraf.sync(entryBuildPath);
//创建entryBuild
fs.mkdirSync(entryBuildPath);
const entryContent = data => `import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/component/common/App';
import Index from '../app/component/${data.path}';
ReactDOM.render(<App page={Index} />,document.getElementById('app'));`;

// 若无需国际化，可以把下面的打开
// const entryContent = data => `import 'babel-polyfill';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import Index from '../app/component/${data.path}';
// import Header from '../app/component/common/Header';
// import Footer from '../app/component/common/Footer';
// ReactDOM.render([<Header key="Header"/>,<div key="Content" className="a-content"><Index /></div>,<Footer key="Footer"/>],document.getElementById('app'));`;
/*生成webpack entry 入口文件*/
entry.map((data) => {
    fs.writeFile(entryBuildPath + '/' + data.name + '.js', entryContent(data), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
    });
});