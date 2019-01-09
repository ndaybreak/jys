import React from 'react';
import intl from 'react-intl-universal'
import {getSearchPara, isLangZH, jumpUrl, kebabCaseData2Camel, ui, validate} from '@/utils'
import {getSessionData, removeSessionData, setSessionData} from '@/data'
import {Button} from 'antd';
import {removeToken} from '@/utils/auth'
import '@/public/css/bind-phone.pcss';
import {getCountryList, getVerifyCodeByPhone, modifyPhoneToServer, setPhoneToServer} from '@/api'
import Box from '@/component/common/ui/Box'
import Breadcrumb from '@/component/common/Breadcrumb'
import phoneIcon from '@/public/img/phone.png';

let timeTicker = '';

class VerifyOldPhone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            breadcrumbData: [{
                path: 'user.html',
                val: intl.get('personalCenter')
            }, {
                val: intl.get('Bind phone')
            }],
            errorMsg: '',
            remainTime: 0,
            verifyCodeBtnText: intl.get("Get Message Code"),
            phoneNumber: undefined,
            areaCode: undefined
        }
    }

    componentDidMount() {
        const user = getSessionData('user');
        this.setState({
            phoneNumber: user.mobile_number,
            areaCode: user.mobile_area_code
        });
    }

    confirm() {
        const validCode = this.refs['verifyCode'].validate();
        if (validCode) {
            setSessionData('verifyCode', this.refs['verifyCode'].getValue());
            jumpUrl('modify-phone.html');
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
            getVerifyCodeByPhone({
                areaCode: this.state.areaCode,
                mobileNumber: this.state.phoneNumber,
                type: "1"
            }).then((res) => {
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
                <div className="modify-title">{intl.get('Bind phone')}</div>
                <div className="modify-content">
                    <div className="error-line">
                        {this.state.errorMsg}
                    </div>
                    <div className="clearfix modify-item">
                        <img src={phoneIcon} alt=""/>
                        <span className={'old-phone-number-label'}>{intl.get('Original mobile phone number')}</span>
                        <button className={'old-phone-number'}>{this.state.phoneNumber}</button>
                    </div>
                    <div className="clearfix modify-item">
                        <img src={phoneIcon} alt=""/>
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

export default VerifyOldPhone;