import React from 'react';
import {getSearchPara, isLangZH, jumpUrl, kebabCaseData2Camel, ui, validate} from '@/utils'
import {getSessionData, removeSessionData, setSessionData} from '@/data'
import '@/public/css/set-capital-password.pcss';
import {getAuthTypeList, getCountryList, queryAuthInfo, saveBasicAuthInfo, savePicAuthInfo} from '@/api'
import Box from '@/component/common/ui/Box'
import Breadcrumb from '@/component/common/Breadcrumb'
import userPwdImg from '@/public/img/user_pwd.png'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            breadcrumbData: [{
                path: 'user.html',
                val: 'Account'
            }, {
                val: 'Capital Password'
            }],
            errorMsg: ''
        }
    }

    componentDidMount() {

    }

    validate() {
        const result1 = this.refs['password'].validate()
        const result2 = this.refs['confirmPassword'].validate()
        if (result1 && result2) {
            if (this.refs['password'].getValue() !== this.refs['confirmPassword'].getValue()) {
                this.setState({
                    errorMsg: 'Entered passwords differ!'
                })
                return false
            } else {
                this.setState({
                    errorMsg: ''
                })
                return true
            }
        } else {
            this.setState({
                errorMsg: ''
            })
            return false
        }
    }

    confirm() {
        if (this.validate()) {
            setSessionData('capitalPassword', {
                moneyPassword: this.refs['password'].getValue()
            })
            removeSessionData('isValidateCodeSend')
            jumpUrl('validate-code.html', {
                from: 'set-capital-password'
            })
        }
    }

    render() {
        return (
            <div className="set-capital-password-page">
                <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                <div className="modify-title">Set your capital password</div>
                <div className="modify-content">
                    <div className="tip tip-assets">
                        If you reset your existing capital password, withdrawal will be prohibited within 24 hours.
                    </div>
                    <div className="error-line">
                        {this.state.errorMsg}
                    </div>
                    <div className="clearfix modify-item">
                        <img src={userPwdImg} alt=""/>
                        <Box ref="password" type="password"
                             placeholder="Please set your capital password(6 digit code)"
                             validates={['notNull', 'sixDigitNumber']}/>
                    </div>
                    <div className="clearfix modify-item">
                        <img src={userPwdImg} alt=""/>
                        <Box ref="confirmPassword" type="password" placeholder="Confirm the new password"
                             validates={['notNull']}/>
                    </div>
                    <button className="btn btn-confirm" onClick={this.confirm.bind(this)}>Confirm</button>
                </div>
            </div>
        );
    }
}

export default Index;