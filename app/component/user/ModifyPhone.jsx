import React from 'react';
import intl from 'react-intl-universal'
import {getSearchPara, isLangZH, jumpUrl, kebabCaseData2Camel, ui, validate} from '@/utils'
import {getSessionData, removeSessionData, setSessionData} from '@/data'
import {Button, Select} from 'antd';
import {removeToken} from '@/utils/auth'
import '@/public/css/bind-phone.pcss';
import {getCountryList, getVerifyCodeByPhone, modifyPhoneToServer, setPhoneToServer} from '@/api'
import Box from '@/component/common/ui/Box'
import Breadcrumb from '@/component/common/Breadcrumb'
import phoneIcon from '@/public/img/user_phone.png';

let oldVerifyCode = '';
let timeTicker = '';

class ModifyPhone extends React.Component {
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
            countryList: undefined,
            open: false,
            selectedCountryCode: undefined,
            remainTime: 0,
            verifyCodeBtnText: intl.get("Get Message Code")
        }
    }

    componentDidMount() {
        oldVerifyCode = getSessionData('verifyCode');
        removeSessionData('verifyCode');
    }

    confirm() {
        const validCode = this.refs['verifyCode'].validate();
        if (!validCode || !this.validPhoneAndCountry()) return;
        let requestParams = {
            mobileNumber: this.refs['phone'].getValue(),
            areaCode: this.state.selectedCountryCode
        };
        const newVerifyCode = this.refs['verifyCode'].getValue();
        this.setState({
            loading: true
        });
        const callbackError = (error) => {
            this.setState({
                loading: false,
                errorMsg: error
            })
        };
        const callbackSuccess = (res) => {
            this.setState({
                loading: false
            });
            ui.tip({
                msg: intl.get('Modify successfully'),
                callback: () => {
                    jumpUrl('login.html')
                }
            })
        };
        const user = getSessionData('user');
        if (user.mobile_number) {
            requestParams.oldVerifyCode = oldVerifyCode;
            requestParams.newVerifyCode = newVerifyCode;
            modifyPhoneToServer(requestParams)
                .then(callbackSuccess(), callbackError);
        } else {
            requestParams.mobileVerifyCode = newVerifyCode;
            requestParams.emailVerifyCode = oldVerifyCode;
            // const params = {...requestParams, mobileVerifyCode: newVerifyCode, emailVerifyCode: oldVerifyCode};
            setPhoneToServer(requestParams)
                .then(callbackSuccess(), callbackError);
        }
    }

    onSelectedCountry(value, option) {
        if (value) {
            this.setState({
                selectedCountryCode: value,
                open: false
            })
        }
    }

    onClickSelectedCountry(event) {
        if (this.state.countryList) {
            this.setState({
                open: true
            })
        } else {
            getCountryList().then((res) => {
                this.setState({
                    countryList: res.data,
                    open: true,
                })
            })
        }
    }

    initCountryOptionItems() {
        if (this.state.countryList) {
            return this.state.countryList.map((value, index) => {
                return (
                    <Select.Option value={value.area_code}
                                   key={value.area_code}>{value.country_name} </Select.Option>);
            });
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

    validPhoneAndCountry() {
        if (!this.state.selectedCountryCode) {
            this.setState({
                errorMsg: intl.get('Please select the nature')
            });
            return false;
        } else {
            this.setState({
                errorMsg: ""
            });
        }
        return this.refs['phone'].validate();
    }

    onClickGetVerifyCode() {
        if (this.validPhoneAndCountry() && this.state.remainTime <= 0) {
            getVerifyCodeByPhone({
                areaCode: this.state.selectedCountryCode,
                mobileNumber: this.refs['phone'].getValue(),
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
        const countrySelectItems = this.initCountryOptionItems();
        return (
            <div className="modify-phone-page">
                <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                <div className="modify-title">{intl.get('Bind phone')}</div>
                <div className="modify-content">
                    <div className="error-line">
                        {this.state.errorMsg}
                    </div>
                    <Select className='country-select' placeholder={intl.get('Please select the nature')}
                            onSelect={this.onSelectedCountry.bind(this)}
                            onFocus={this.onClickSelectedCountry.bind(this)}>
                        {countrySelectItems}
                    </Select>
                    <div className="clearfix modify-item">
                        <img src={phoneIcon} alt=""/>
                        <Box ref="phone" type="phone"
                             placeholder={intl.get('Please enter new phone')}
                             validates={['notNull']}/>
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
                            onClick={this.confirm.bind(this)}>{intl.get('confirmBtn')}</Button>
                </div>
            </div>
        );
    }
}

export default ModifyPhone;