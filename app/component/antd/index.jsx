import React from 'react';
import {Menu, Dropdown, Icon, Carousel} from 'antd';
// import 'antd/dist/antd.css'
import '../../public/css/antd.pcss';

import 'antd/lib/carousel/style/css';

import $ from 'jquery';

const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
        </Menu.Item>
    </Menu>
)

class Antd extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            $('#test').html('aaaaaaaaaaaaaa')
        }, 2000)
    }
    render() {
        return (
            <div className="antd">
                这是antd
                <div>
                    <Dropdown overlay={menu} placement="bottomLeft">
                        <span>bottomLeft</span>
                    </Dropdown>
                </div>
                <div>
                    <Carousel autoplay>
                        <div><h3>1</h3></div>
                        <div><h3>2</h3></div>
                        <div><h3>3</h3></div>
                        <div><h3>4</h3></div>
                    </Carousel>
                </div>
                <div id="test">
                    sss
                </div>
            </div>
        );
    }
}

export default Antd;