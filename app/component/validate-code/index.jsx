import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button} from 'antd'
import '@/public/css/validate-code.pcss';
import ReactCodeInput from 'react-code-input'
import {jumpUrl, validate, getSearchPara, ui} from '@/utils'
import {setToken, getUser, refreshAccountInfo, removeToken} from '@/utils/auth'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import {
    sendEmailValidateCode,
    registerByEmail,
    entrustmentTrade,
    setCapitalPwd,
    legalWithdraw,
    withdrawApplication,
    saveOrUpdatePayAccountInfo,
    deleteBank,
    resetLoginPwd
} from '@/api'
import emailImg from '@/public/img/邮件.png'

const REMAIN_TIME = 'validate_code_remain_time'

let data = {}
let email = ''
let type = ''
let nextPageName = undefined;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false,
            verifyCode: '',
            remainingTime: 60,
            errorMsg: '',
            submitBtnText: intl.get('submit')
        }
    }

    componentDidMount() {
        if (getSearchPara('from') === 'register') {
            data = getSessionData('registerInfo')
            type = 2
        } else if (getSearchPara('from') === 'deal') {
            data = getSessionData('dealOrder')
            type = 6
        } else if (getSearchPara('from') === 'set-capital-password') {
            data = getSessionData('capitalPassword')
            type = 5
        } else if (getSearchPara('from') === 'withdraw') {
            data = getSessionData('withdrawData')
            type = 6
        } else if (getSearchPara('from') === 'legal-withdraw') {
            data = getSessionData('legalWithdrawData')
            type = 6
        } else if (getSearchPara('from') === 'bank-add') {
            data = getSessionData('bankAddData')
            type = 7
        } else if (getSearchPara('from') === 'bank-list') {
            type = 7
        } else if (getSearchPara('from') === 'forget-login-password') {
            data = getSessionData('forgetLoginPassword')
            type = 4
        } else if(getSearchPara('from') === 'user'){
            type = 1
            this.setState({
                submitBtnText: intl.get('next')
            })
            nextPageName = getSessionData('nextPageName')
            removeSessionData('nextPageName')
        }

        if (getSearchPara('from') === 'register' || getSearchPara('from') === 'forget-login-password') {
            email = data.email
        } else {
            email = getUser().email
        }
        if (!getSessionData('isValidateCodeSend')) {
            this.sendEmailValidateCode()
        } else {
            let time = parseInt(getSessionData(REMAIN_TIME) || 0)
            this.setState({
                remainingTime: time
            })
            if (time > 0) {
                this.startValidateCodeTime()
            }
        }
    }

    submit() {
        if (this.state.verifyCode.length < 6) {
            this.setState({
                errorMsg: intl.get('loginCodeTip')
            })
            return
        }

        if (nextPageName) {
            setSessionData('verifyCode', this.state.verifyCode);
            jumpUrl(nextPageName + '.html');
            return;
        }

        this.setState({
            submitLoading: true
        })
        if (getSearchPara('from') === 'register') {
            this.registerSubmit()
        } else if (getSearchPara('from') === 'deal') {
            this.dealOrderSubmit()
        } else if (getSearchPara('from') === 'set-capital-password') {
            this.capitalPwdSubmit()
        } else if (getSearchPara('from') === 'withdraw') {
            this.withdrawSubmit()
        } else if (getSearchPara('from') === 'legal-withdraw') {
            this.legalWithdrawSubmit()
        } else if (getSearchPara('from') === 'bank-add') {
            this.bankAddSubmit()
        } else if (getSearchPara('from') === 'bank-list') {
            this.bankDeleteSubmit()
        } else if (getSearchPara('from') === 'forget-login-password') {
            this.setLoginPasswordSubmit();
        }
    }

    setLoginPasswordSubmit() {
        const para = Object.assign({}, data, {verifyCode: this.state.verifyCode})
        resetLoginPwd(para).then(res => {
            removeToken();
            ui.tip({
                msg: intl.get('Login password modify successfully'),
                callback: () => {
                    jumpUrl('login.html')
                }
            })
        }, error => {
            this.setState({
                submitLoading: false,
                errorMsg: error
            })
        })
    }


    registerSubmit() {
        const para = Object.assign({}, data, {verifyCode: this.state.verifyCode})
        registerByEmail(para).then(res => {
            setToken(res.data.token).then(res => {
                if (data.type == 1) {
                    jumpUrl('auth.html')
                } else {
                    jumpUrl('auth-corporate.html')
                }
            })
            // ui.tip({
            //     msg: intl.get('registerSuccess'),
            //     callback: () => {
            //         // jumpUrl('index.html')
            //         console.log(data)
            //         if(data.type == 1) {
            //             jumpUrl('auth.html', {
            //                 from: 'register'
            //             })
            //         } else {
            //             jumpUrl('auth-corporate.html', {
            //                 from: 'register'
            //             })
            //         }
            //     }
            // })
        }, error => {
            this.setState({
                submitLoading: false,
                errorMsg: error.info
            })
        })
    }

    dealOrderSubmit() {
        const para = Object.assign({}, data, {emailVerifyCode: this.state.verifyCode})
        entrustmentTrade(para).then(res => {
            ui.tip({
                msg: intl.get('successTip'),
                callback: () => {
                    jumpUrl('deal.html', {
                        base: getSearchPara('base'),
                        target: getSearchPara('target')
                    })
                }
            })
        }, error => {
            // this.setState({
            //     submitLoading: false,
            //     errorMsg: error
            // })
            jumpUrl('deal.html', {
                base: getSearchPara('base'),
                target: getSearchPara('target')
            })
        })
    }

    capitalPwdSubmit() {
        const para = Object.assign({}, data, {verifyCode: this.state.verifyCode})
        setCapitalPwd(para).then(res => {
            refreshAccountInfo().then(res => {
                ui.tip({
                    msg: intl.get('successTip'),
                    callback: () => {
                        jumpUrl('user.html')
                    }
                })
            })
        }, error => {
            this.setState({
                submitLoading: false,
                errorMsg: error.info
            })
        })
    }

    withdrawSubmit() {
        const para = Object.assign({}, data, {emailVerifyCode: this.state.verifyCode})
        withdrawApplication(para).then(res => {
            this.setState({
                submitLoading: false
            })
            ui.tip({
                msg: intl.get('successTip'),
                callback: () => {
                    jumpUrl('withdraw.html', {
                        code: getSearchPara('code'),
                        id: getSearchPara('id')
                    })
                }
            })
        }, error => {
            this.setState({
                submitLoading: false,
                errorMsg: error.info
            })
        })
    }

    legalWithdrawSubmit() {
        const para = Object.assign({}, data, {emailVerifyCode: this.state.verifyCode})
        legalWithdraw(para).then(res => {
            ui.tip({
                msg: intl.get('successTip'),
                callback: () => {
                    jumpUrl('user.html')
                }
            })
        }, error => {
            this.setState({
                submitLoading: false,
                errorMsg: error.info
            })
        })
    }

    bankAddSubmit() {
        const para = Object.assign({}, data, {emailVerifyCode: this.state.verifyCode})
        saveOrUpdatePayAccountInfo(para).then(res => {
            ui.tip({
                msg: intl.get('successTip'),
                callback: () => {
                    jumpUrl('bank-list.html')
                }
            })
        }, error => {
            this.setState({
                submitLoading: false,
                errorMsg: error.info
            })
        })
    }
    bankDeleteSubmit() {
        const para = Object.assign({}, data, {emailVerifyCode: this.state.verifyCode, id: getSearchPara('id')})
        deleteBank(para).then(res => {
            ui.tip({
                msg: intl.get('successTip'),
                callback: () => {
                    jumpUrl('bank-list.html')
                }
            })
        }, error => {
            this.setState({
                submitLoading: false,
                errorMsg: error.info
            })
        })
    }

    sendEmailValidateCode() {
        sendEmailValidateCode(email, type).then(res => {
            setSessionData('isValidateCodeSend', true)
            this.setState({
                remainingTime: 60
            })
            this.startValidateCodeTime()
        })
    }

    startValidateCodeTime() {
        const interval = setInterval(() => {
            if (this.state.remainingTime === 0) {
                clearInterval(interval)
            } else {
                let time = --this.state.remainingTime
                this.setState({
                    remainingTime: time
                })
                setSessionData(REMAIN_TIME, time)
            }
        }, 1000)
    }

    emailCodeChange(code) {
        this.setState({
            verifyCode: code
        })
    }

    reSend() {
        this.sendEmailValidateCode()
    }

    render() {
        return (
            <div className="register-page register-validate-page">
                <div className="title"><img src={emailImg} alt=""/>{intl.get('verifyEmail')}</div>
                <div className="sub-title">{intl.get('register_txt_1')}</div>
                <div className="error-wrap">{this.state.errorMsg}</div>
                <ReactCodeInput className="email-code" type='text' fields={6}
                                onChange={this.emailCodeChange.bind(this)}/>
                <div className="item-wrap clearfix">
                    {this.state.remainingTime > 0 && (
                        <span className="remaining-time">{this.state.remainingTime} {intl.get('timeResend')}</span>
                    )}
                    {this.state.remainingTime == 0 && (
                        <a className="re-send" href="javascript:"
                           onClick={this.reSend.bind(this)}>{intl.get('resendCode')}</a>
                    )}
                </div>
                <div className="item-wrap btn-wrap">
                    <Button className="btn-login-big" key="submit" type="primary" loading={this.state.submitLoading}
                            onClick={this.submit.bind(this)}>
                        {intl.get('submit')}
                    </Button>
                </div>
            </div>
        );
    }
}

export default Index;