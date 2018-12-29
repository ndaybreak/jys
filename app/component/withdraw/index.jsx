import React from 'react';
import intl from 'react-intl-universal'
var QRCode = require('qrcode-react')
import ReactCodeInput from 'react-code-input'
import Breadcrumb from '@/component/common/Breadcrumb'
import RechargeSelect from '@/component/recharge/RechargeSelect'
import { Icon, Modal, Button, Select } from 'antd'
import { jumpUrl, validate, ui } from '@/utils'
import '@/public/css/withdraw.pcss';
import codeImgDefault from '@/public/img/二维码占位符.png'
import logoImg from '@/public/img/code_logo.png'
import { getWithdrawAddress, getAssetList, getWithdrawInfo, withdrawApplication } from '@/api'

const assetMap = {}
const defaultValue = '--'
let coinId

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbData: [{
                path: 'user.html',
                val: intl.get('personalCenter')
            }, {
                val: intl.get('withdrawal')
            }],
            withdrawValue: '',
            balance: defaultValue,
            withdraw_precision: defaultValue,
            fee: defaultValue,
            dayLimit: defaultValue,
            dayUsed: defaultValue,
            minQuantity: defaultValue,
            actualValue: defaultValue,
            password: ''
        }
    }

    componentWillMount() {

    }
    componentDidMount() {
        getAssetList().then(res => {
            res.data.forEach(item => {
                assetMap[item.coin_code] = item.available_balance
            })
        })
    }

    componentWillUnmount() {
    }

    handleCoinChange(item) {
        coinId = item.id
        getWithdrawAddress(item.id).then(res => {
            this.setState({
                address: res.data[0] && res.data[0].address
            })
        }, error => {
            ui.tip({
                width: 300,
                msg: error
            })
        })
        getWithdrawInfo(item.id).then(res => {
            this.setState({
                balance: assetMap[item.coin_code],
                coinCode: item.coin_code,
                withdraw_precision: res.data.single_limit.withdraw_precision,
                fee: res.data.single_limit.fee_rate,
                dayLimit: res.data.day_limit.total,
                dayUsed: res.data.day_limit.used,
                minQuantity: res.data.single_limit.min_quantity,
                withdrawValue: '',
                actualValue: defaultValue
            })
        }, error => {
            ui.tip({
                width: 600,
                msg: error
            })
        })
    }

    handleValueChange(e) {
        const value = typeof e === 'object' ? e.target.value : e
        let actualVal
        if(value === defaultValue || this.state.fee === defaultValue || !value) {
            actualVal = defaultValue
        } else {
            actualVal = parseFloat((value - this.state.fee).toFixed(8))
        }
        this.setState({
            withdrawValue: value,
            actualValue: actualVal < 0 ? 0 : actualVal
        })
    }
    allIn() {
        if(!this.state.coinCode) {
            return
        }
        const use = this.state.dayLimit - this.state.dayUsed
        this.handleValueChange(use < this.state.balance  ? use : this.state.balance)
    }

    validate() {
        const value = this.state.withdrawValue
        let msg,
            addressMsg
        if(!value) {
            msg = intl.get('enterTip')
        } else if(value > this.state.balance) {
            msg = intl.get('availableTip')
        } else if(value > (this.state.dayLimit - this.state.dayUsed)) {
            msg = intl.get('withdrawDayLimit')
        } else if(value < this.state.minQuantity) {
            msg = intl.get('MinWithdraw') + this.state.minQuantity
        }

        if(!this.state.address) {
            addressMsg = intl.get('enterTip')
        }
        if(msg) {
            this.setState({
                errorMsg: msg
            })
        } else {
            this.setState({
                errorMsg: ''
            })
        }

        if(addressMsg) {
            this.setState({
                addressMsg: addressMsg
            })
        } else {
            this.setState({
                addressMsg: ''
            })
        }
        if(msg || addressMsg) {
            return false
        } else {
            return true
        }
    }
    submit() {
        if(!this.state.coinCode) {
            return
        }
        if(this.validate()) {
            this.setState({
                visible: true
            })
        }
    }

    handleCancel() {
        this.setState({
            visible: false
        })
    }
    handleOk() {
        if(this.state.password.length < 6) {
            this.setState({
                passwordMsg: intl.get('pwdTip')
            })
        } else {
            let para = {
                coinId: coinId,
                quantity: this.state.withdrawValue,
                toAddress: this.state.address,
                moneyPassword: this.state.password
            }
            this.setState({
                loading: true
            })
            withdrawApplication(para).then(res => {
                this.setState({
                    visible: false
                })
                ui.tip({
                    msg: intl.get('withdrawRequestSubmitted'),
                    callback: () => {
                        window.location.reload()
                    }
                })
            }, error => {
                this.setState({
                    visible: false,
                    loading: false
                })
                ui.tip({
                    msg: error
                })
            })
        }
    }
    passwordChange(val) {
        this.setState({
            password: val
        })
    }

    handleAddressChange(e) {
        this.setState({
            address: e.target.value
        })
    }

    render() {
        return (
            <div className="recharge-withdraw-page">
                <div className="header">
                    <span className="title">{intl.get('withdrawal')}</span>
                    <RechargeSelect onChange={this.handleCoinChange.bind(this)} />
                </div>
                <div className="content">
                    <div className="content-inner">
                        <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                        <div className="module-name">{intl.get('availableBalance')}
                            <span className="balance">{this.state.balance}</span>
                            <span className="coin-code">{this.state.coinCode}</span>
                        </div>
                        <div className="error-line">{this.state.errorMsg}</div>
                        <div className="module-name">{intl.get('withdrawValue')}
                            <input className={'withdraw-value ' + (this.state.errorMsg ? 'error' : '')} disabled={this.state.coinCode ? false : true} type="number" step={this.state.withdraw_precision} value={this.state.withdrawValue} onChange={this.handleValueChange.bind(this)}/>
                            <a href="javascript:" className={'btn-all ' + (this.state.coinCode ? '' : 'disabled')} onClick={this.allIn.bind(this)}>{intl.get('all')}</a>
                        </div>
                        <div className="fee-line">
                            {intl.get('feed')}：<span className="value">{this.state.fee}</span><span className="coin-code" style={{marginRight: '130px'}}>{this.state.coinCode}</span>
                            {intl.get('receiveAmount')}：<span className="value">{this.state.actualValue}</span><span className="coin-code">{this.state.coinCode}</span>
                        </div>
                        <div className="limit-line">
                            {intl.get('limitDescription')} |
                            <span className="label">{intl.get('dailyWithdrawLimit')}：</span><span className="value">{this.state.dayLimit}</span><span className="coin-code">{this.state.coinCode}</span>
                            <span className="label">{intl.get('dailyUsed')}：</span><span className="value">{this.state.dayUsed}</span><span className="coin-code">{this.state.coinCode}</span>
                            <span className="label">{intl.get('minQuantity')}：</span><span className="value">{this.state.minQuantity}</span><span className="coin-code">{this.state.coinCode}</span>
                        </div>

                        <div className="module-name" style={{marginTop: '50px'}}>{intl.get('withdrawAddress')}
                            <span className="address-msg">{this.state.addressMsg}</span>
                        </div>
                        <textarea className={'code' + (this.state.addressMsg ? ' error' : '')} type="textarea"  disabled={this.state.coinCode ? false : true} rows="3" value={this.state.address} onChange={this.handleAddressChange.bind(this)}>
                        </textarea>

                        <div className="note">
                            {intl.get('withdrawTip')}
                        </div>
                        <div className="btn-wrap">
                            <button className={'btn-submit-now ' + (this.state.coinCode ? '' : 'disabled')} onClick={this.submit.bind(this)}>{intl.get('submitNow')}</button>
                        </div>
                    </div>
                </div>

                <Modal
                    className="modal-confirm-davao"
                    visible={this.state.visible}
                    width={330}
                    style={{top: 250}}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button key="back" className="btn-cancel" onClick={this.handleCancel.bind(this)}>{intl.get('cancelBtn')}</Button>,
                        <Button key="submit" className="btn-submit" type="primary" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
                            {intl.get('confirmBtn')}
                        </Button>,
                    ]}
                >
                    <div className="davao-confirm-wrap">
                        <div className="title">{intl.get('capitalPasswordTip')}</div>
                        <div className="submit-div">
                            {this.state.visible && (
                                <ReactCodeInput className="password-value" type='text' fields={6} onChange={this.passwordChange.bind(this)}/>
                            )}
                        </div>
                        <div className="error">
                            {this.state.passwordMsg}
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Index;