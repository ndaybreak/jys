import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin} from 'antd'
import ReactCodeInput from 'react-code-input'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH} from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import '@/public/css/legal-withdraw.pcss';
import {getCountryList, saveBasicAuthInfo, savePicAuthInfo, queryAuthInfo, getAuthTypeList, getAuthVideoCode, getBankList} from '@/api'
import Box from '@/component/common/ui/Box'
import BoxDate from '@/component/common/ui/BoxDate'
import BoxSelect from '@/component/common/ui/BoxSelect'
import { refreshAccountInfo } from '@/utils/auth'
import Record from './Record'

const SEND_FLAG = 'isValidateCodeSend'

function formatBankData(data) {
    const bank = {}
    const list = []
    const account = {}
    data.forEach((item, i) => {
        item.account = item.pay_account_name + ' (' + item.pay_account_number + ')'
        bank[item.bankName] = 1
        if(account[item.bankName]) {
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
            password: ''
        }
    }

    componentDidMount() {
        getBankList().then(res => {
            const data = formatBankData(res.data)
            this.setState({
                bankList: data[0],
                accountData: data[1]
            })
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
            this.setState({
                visible: false
            })

            const para = {
                payAccountId: this.refs['account'].getValue(),
                amount: this.refs['amount'].getValue(),
                moneyPassword: this.state.password
            }
            setSessionData('legalWithdrawData', para)
            removeSessionData(SEND_FLAG)
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

    render() {
        return (
            <Spin spinning={this.state.loading}>
                <div className="legal-recharge-page">
                    <div className="tip-part">
                        <div className="tip">
                            Minimum Withdrawal：$100, Max daily withdrawal: $500000 <br/>
                            Base Withdrawal Fee is 0.2%, subject to a minimum of $20, the fee for over-withdrawal is 3%（Excluding Bank Fees.）<br/>
                            Over-withdrawal: more than 4 (inclusive) transactions or more than $1,000,000(inclusive) equivalent cash withdrawals within last 30 days. <br/>
                            The withdraw bank account must have the same name as your Coinsuper account, it normally takes 3 to 5 working days for the money to reflect in your bank account.
                        </div>
                    </div>
                    <div className="info-part withdraw-info-part">
                        <div className="withdraw-info">
                            <div className="available">Available: <span className="total">30.00</span><span className="currency">HKD</span></div>
                            <div className="limit">Limit Per Transaction: <span className="value">10000.00</span></div>
                            <div className="clearfix" style={{paddingLeft: '202px'}}>
                                <Box ref="amount" className="amount-box" placeholder="Please enter withdrawal amount"
                                     validates={['notNull']}/>
                            </div>
                            <div className="fee">Cash Withdrawal Fee : <span className="value">20.00</span></div>
                        </div>
                        <div className="clearfix">
                            <BoxSelect ref="bank" className="auth-box-left"
                                       placeholder="Bank Name" validates={['isSelect']}
                                       onChange={this.bankChange.bind(this)}
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
                            <Button key="back" className="btn-cancel" onClick={this.handleCancel.bind(this)}>{intl.get('cancelBtn')}</Button>,
                            <Button key="submit" className="btn-submit" type="primary" onClick={this.handleOk.bind(this)}>
                                {intl.get('confirmBtn')}
                            </Button>,
                        ]}
                    >
                        <div className="davao-confirm-wrap">
                            <div className="title">{intl.get('capitalPasswordTip')}</div>
                            <div className="submit-div">
                                {this.state.visible && (
                                    <ReactCodeInput className="password-value" type='password' fields={6} onChange={this.passwordChange.bind(this)}/>
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