import React from 'react';
import intl from 'react-intl-universal'
import {getSearchPara, isLangZH, jumpUrl, kebabCaseData2Camel, ui, validate} from '@/utils'
import { getUser } from '@/utils/auth'
import {getSessionData, removeSessionData, setSessionData} from '@/data'
import {Button} from 'antd';
import {removeToken} from '@/utils/auth'
import '@/public/css/bind-phone.pcss';
import {sendEmailValidateCode} from '@/api'
import Box from '@/component/common/ui/Box'
import Breadcrumb from '@/component/common/Breadcrumb'
import emailIcon from '@/public/img/user_email.png';

let timeTicker = '';

class VerifyOldEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            breadcrumbData: [{
                path: 'user.html',
                val: intl.get('personalCenter')
            }, {
                val: intl.get('Bind email')
            }],
            errorMsg: '',
            remainTime: 0,
            verifyCodeBtnText: intl.get("Get Message Code"),
            email: undefined,
        }
    }

    componentDidMount() {
        const user = getUser()
        this.setState({
            email: user.email,
        });
    }

    confirm() {
        const validCode = this.refs['verifyCode'].validate();
        if (validCode) {
            setSessionData('verifyCode', this.refs['verifyCode'].getValue());
            jumpUrl('modify-email.html');
        }
    }

    startTimeTicker() {
        if (timeTicker) {
            clearInterval(timeTicker);
        }
        this.setState({remainTime: 60});
        timeTicker = setInterval(() => {
            let time = this.state.remainTime;
            if (--time <= 0) {
                this.setState({
                    remainTime: 0,
                    verifyCodeBtnText: intl.get('resendCode')
                });
                clearInterval(timeTicker);
            } else {
                this.setState({
                    remainTime: time,
                    verifyCodeBtnText: time + intl.get('timeResend')
                });
            }
        }, 1000);
    }

    onClickGetVerifyCode() {
        if (this.state.remainTime <= 0) {
            sendEmailValidateCode(this.state.email, "1").then((res) => {
                this.startTimeTicker();
            }, (error) => {
                this.setState({
                    errorMsg: error
                })
            })
        }
    }

    render() {
        return (
            <div className="modify-phone-page">
                <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                <div className="modify-title">{intl.get('Bind email')}</div>
                <div className="modify-content">
                    <div className="error-line">
                        {this.state.errorMsg}
                    </div>
                    <div className="clearfix modify-item">
                        <img src={emailIcon} alt=""/>
                        <span className={'old-phone-number-label'}>{intl.get('Original email')}</span>
                        <button className={'old-phone-number'}>{this.state.email}</button>
                    </div>
                    <div className="clearfix modify-item">
                        <img src={emailIcon} alt=""/>
                        <Box ref="verifyCode" type="text"
                             placeholder={intl.get('Please enter verifyCode')}
                             validates={['notNull']}/>
                        <span className={'verify-code'}
                              onClick={this.onClickGetVerifyCode.bind(this)}>{this.state.verifyCodeBtnText}</span>
                    </div>
                    <Button className="btn btn-confirm" key="submit" type="primary" loading={this.state.loading}
                            onClick={this.confirm.bind(this)}>{intl.get('next')}</Button>
                </div>
            </div>
        );
    }
}

export default VerifyOldEmail;