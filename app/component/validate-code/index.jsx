import React from 'react';
import intl from 'react-intl-universal'
import { Icon, Modal, Button } from 'antd'
import '@/public/css/validate-code.pcss';
import ReactCodeInput from 'react-code-input'
import { jumpUrl, validate, getSearchPara, ui } from '@/utils'
import { setToken } from '@/utils/auth'
import { setSessionData, getSessionData, removeSessionData } from '@/data'
import { sendEmailValidateCode, registerByEmail, entrustmentTrade } from '@/api'
import emailImg from '@/public/img/邮件.png'

const SEND_FLAG = 'isValidateCodeSend'
const REMAIN_TIME = 'validate_code_remain_time'

let data = {}
let email = ''
let type = ''

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false,
            verifyCode: '',
            remainingTime: 60,
            errorMsg: ''
        }
    }

    componentDidMount() {
        if(getSearchPara('from') === 'register') {
            data = getSessionData('registerInfo')
            type = 2
        } else if(getSearchPara('from') === 'deal') {
            data = getSessionData('dealOrder')
            type = 6
        }

        if(getSearchPara('from') === 'register') {
            email = data.email
        } else {
            email = getSessionData('user').email
        }
        if(!getSessionData(SEND_FLAG)) {
            this.sendEmailValidateCode()
        } else {
            let time = parseInt(getSessionData(REMAIN_TIME) || 0)
            this.setState({
                remainingTime: time
            })
            if(time > 0) {
                this.startValidateCodeTime()
            }
        }
    }

    sendEmailValidateCode() {
        sendEmailValidateCode(email, type).then(res => {
            setSessionData(SEND_FLAG, true)
            this.setState({
                remainingTime: 60
            })
            this.startValidateCodeTime()
        })
    }

    startValidateCodeTime() {
        const interval = setInterval(() => {
            if(this.state.remainingTime === 0) {
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

    submit() {
        if(this.state.verifyCode.length < 6) {
            this.setState({
                errorMsg: intl.get('loginCodeTip')
            })
            return
        }
        this.setState({
            submitLoading: true
        })
        if(getSearchPara('from') === 'register') {
            this.registerSubmit()
        } else if(getSearchPara('from') === 'deal') {
            this.dealOrderSubmit()
        }
    }
    registerSubmit() {
        const para = Object.assign({}, data, {verifyCode: this.state.verifyCode})
        registerByEmail(para).then(res => {
            setToken(res.data.token)
            ui.tip({
                msg: intl.get('registerSuccess'),
                callback: () => {
                    jumpUrl('index.html')
                }
            })
        }, error => {
            this.setState({
                submitLoading: false,
                errorMsg: error
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

    reSend() {
        this.sendEmailValidateCode()
    }

    render() {
        return (
            <div className="register-page register-validate-page">
                <div className="title"><img src={emailImg} alt=""/>{intl.get('verifyEmail')}</div>
                <div className="sub-title">{intl.get('register_txt_1')}</div>
                <div className="error-wrap">{this.state.errorMsg}</div>
                <ReactCodeInput className="email-code" type='text' fields={6} onChange={this.emailCodeChange.bind(this)}/>
                <div className="item-wrap clearfix">
                    {this.state.remainingTime > 0 && (
                        <span className="remaining-time">{this.state.remainingTime} {intl.get('timeResend')}</span>
                    )}
                    {this.state.remainingTime == 0 && (
                        <a className="re-send" href="javascript:" onClick={this.reSend.bind(this)}>{intl.get('resendCode')}</a>
                    )}
                </div>
                <div className="item-wrap btn-wrap">
                    <Button className="btn-login-big" key="submit" type="primary" loading={this.state.submitLoading} onClick={this.submit.bind(this)}>
                        {intl.get('submit')}
                    </Button>
                </div>
            </div>
        );
    }
}

export default Index;