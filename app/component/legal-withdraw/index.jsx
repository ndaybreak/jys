import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin} from 'antd'
import ReactCodeInput from 'react-code-input'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, format2Percentage} from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import '@/public/css/legal-withdraw.pcss';
import {
    getCountryList,
    saveBasicAuthInfo,
    savePicAuthInfo,
    queryAuthInfo,
    getAuthTypeList,
    getAuthVideoCode,
    getBankList,
    getLegalConfigInfo
} from '@/api'
import Box from '@/component/common/ui/Box'
import BoxDate from '@/component/common/ui/BoxDate'
import BoxSelect from '@/component/common/ui/BoxSelect'
import BoxNumber from '@/component/common/ui/BoxNumber'
import {refreshAccountInfo} from '@/utils/auth'
import Record from './Record'

let RATE = 0

function formatBankData(data) {
    const bank = {}
    const list = []
    const account = {}
    data = data.filter(item => {
        return item.status === 3
    })
    data.forEach((item, i) => {
        item.account = item.pay_account_name + ' (' + item.pay_account_number + ')'
        bank[item.bankName] = 1
        if (account[item.bankName]) {
            account[item.bankName].push(item)
        } else {
            account[item.bankName] = [item]
        }
    })
    Object.keys(bank).forEach(b => {
        list.push({
            id: b,
            bankName: b
        })
    })
    return [list, account]
}

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bankList: [],
            accountList: [],
            accountData: [],
            loading: false,
            visible: false,
            passwordMsg: '',
            password: '',
            fee: 0,
            precision: 0.01,
            bankDefault: ''
        }
    }

    componentDidMount() {
        getBankList(getSearchPara('id')).then(res => {
            const data = formatBankData(res.data)
            const defaultBankId = data[0].length ? data[0][0].id : ''
            this.setState({
                bankList: data[0],
                accountData: data[1],
                bankDefault: defaultBankId
            })
            defaultBankId && this.bankChange(defaultBankId)
        })
        const para = {
            type: 2,
            coinId: getSearchPara('id')
        }
        getLegalConfigInfo(para).then(res => {
            this.setState({
                currency: getSearchPara('code'),
                available: res.data.availableBalance,
                limit: res.data.min_quantity,
                rate: format2Percentage(res.data.fee_rate),
                precision: res.data.withdraw_precision
            })
            RATE = res.data.fee_rate || 0
        })
    }

    validateBasicInfo() {
        const bankValid = this.refs['bank'].validate()
        const accountValid = this.refs['account'].validate()
        const amountValid = this.refs['amount'].validate()

        return bankValid && accountValid && amountValid
    }

    handleSubmit() {
        if (this.validateBasicInfo()) {
            this.setState({
                visible: true
            })
        }
    }

    bankChange(bank) {
        this.setState({
            accountList: this.state.accountData[bank]
        })
        if(bank) {
            this.refs.account.setValue(this.state.accountData[bank][0].id)
        } else {
            this.refs.account.setValue(undefined)
        }
    }

    handleCancel() {
        this.setState({
            visible: false
        })
    }

    handleOk() {
        if (this.state.password.length < 6) {
            this.setState({
                passwordMsg: intl.get('pwdTip')
            })
        } else {
            this.setState({
                visible: false
            })

            const para = {
                payAccountId: this.refs['account'].getValue(),
                amount: this.refs['amount'].getValue(),
                moneyPassword: this.state.password
            }
            setSessionData('legalWithdrawData', para)
            removeSessionData('isValidateCodeSend')
            jumpUrl('validate-code.html', {
                from: 'legal-withdraw'
            })
        }
    }

    passwordChange(val) {
        this.setState({
            password: val
        })
    }

    amountChange(val) {
        this.setState({
            fee: (RATE * val).toFixed(2)
        })
    }

    render() {
        return (
            <Spin spinning={this.state.loading}>
                <div className="legal-recharge-page">
                    <div className="tip-part">
                        <div className="tip">
                            Minimum Withdrawal：HK$100, Max daily withdrawal: HK$100,000 <br/>
                            Base Withdrawal Fee is 0.1% (Excluding Bank Fees）<br/>
                            The withdraw bank account must have the same name as your HKSTOx account, asset arrival time depends on bank processing time.<br/>
                        </div>
                    </div>
                    <div className="info-part withdraw-info-part">
                        <div className="withdraw-info">
                            <div className="available">Available: <span
                                className="total">{this.state.available}</span><span
                                className="currency">{this.state.currency}</span></div>
                            <div className="limit">Minimum Amount Per Transaction: <span
                                className="value">{this.state.limit}</span></div>
                            <div className="clearfix" style={{paddingLeft: '202px'}}>
                                <BoxNumber ref="amount" className="amount-box" step={this.state.precision}
                                     placeholder="Please enter withdrawal amount" onChange={this.amountChange.bind(this)}
                                     validates={['notNull']}/>
                            </div>
                            <div className="fee">Cash Withdrawal Fee({this.state.rate}) : <span
                                className="value">{this.state.fee}</span></div>
                        </div>
                        <div className="clearfix">
                            <BoxSelect ref="bank" className="auth-box-left"
                                       placeholder="Bank Name" validates={['isSelect']}
                                       onChange={this.bankChange.bind(this)}
                                       defaultValue={this.state.bankDefault}
                                       options={this.state.bankList} optValue="id" optLabel="bankName"/>
                            <BoxSelect ref="account" className="auth-box-right"
                                       placeholder="Bank Account" validates={['isSelect']}
                                       options={this.state.accountList} optValue="id" optLabel="account"/>
                        </div>

                        <div className="text-center">
                            <button className="btn btn-next" onClick={this.handleSubmit.bind(this)}>Submit</button>
                        </div>
                    </div>

                    <Record/>

                    <Modal
                        className="modal-confirm-davao"
                        visible={this.state.visible}
                        width={330}
                        style={{top: 250}}
                        onOk={this.handleOk.bind(this)}
                        onCancel={this.handleCancel.bind(this)}
                        footer={[
                            <Button key="back" className="btn-cancel"
                                    onClick={this.handleCancel.bind(this)}>{intl.get('cancelBtn')}</Button>,
                            <Button key="submit" className="btn-submit" type="primary"
                                    onClick={this.handleOk.bind(this)}>
                                {intl.get('confirmBtn')}
                            </Button>,
                        ]}
                    >
                        <div className="davao-confirm-wrap">
                            <div className="title">{intl.get('capitalPasswordTip')}</div>
                            <div className="submit-div">
                                {this.state.visible && (
                                    <ReactCodeInput className="password-value" type='password' fields={6}
                                                    onChange={this.passwordChange.bind(this)}/>
                                )}
                            </div>
                            <div className="error">
                                {this.state.passwordMsg}
                            </div>
                        </div>
                    </Modal>
                </div>
            </Spin>
        );
    }
}

export default Index;