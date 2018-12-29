import React from 'react';
import intl from 'react-intl-universal'
var QRCode = require('qrcode-react')
import Breadcrumb from '@/component/common/Breadcrumb'
import RechargeSelect from '@/component/recharge/RechargeSelect'
import { Icon, Modal, Button, Select } from 'antd'
import { jumpUrl, validate, ui } from '@/utils'
import '@/public/css/recharge.pcss';
import codeImgDefault from '@/public/img/二维码占位符.png'
import logoImg from '@/public/img/code_logo.png'
import { getRechargeAddress } from '@/api'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbData: [{
                path: 'user.html',
                val: intl.get('personalCenter')
            }, {
                val: intl.get('deposit')
            }]
        }
    }

    componentWillMount() {

    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    handleCoinChange(item) {
        getRechargeAddress(item.id).then(res => {
            this.setState({
                address: res.data.address
            })
        }, error => {
            ui.tip({
                width: 300,
                msg: error
            })
        })
    }

    render() {
        return (
            <div className="recharge-withdraw-page">
                <div className="header">
                    <span className="title">{intl.get('deposit')}</span>
                    <RechargeSelect onChange={this.handleCoinChange.bind(this)} />
                </div>
                <div className="content">
                    <div className="content-inner">
                        <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                        <div className="module-name">{intl.get('rechargeAddress')}</div>
                        <div className="code">
                            {this.state.address}
                            {!this.state.address && (
                                <div className="address-empty">--</div>
                            )}
                        </div>
                        <div className="code-label">{intl.get('rechargeRqCode')}</div>
                        {!this.state.address && (
                            <img className="code-img" src={codeImgDefault} alt=""/>
                        )}
                        {this.state.address && (
                            <div className="code-img">
                                <QRCode value={this.state.address} size={160} logo={logoImg} logoWidth={30}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;