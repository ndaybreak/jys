import React from 'react';
import intl from 'react-intl-universal'
import {getSearchPara, isLangZH, jumpUrl, kebabCaseData2Camel, ui, validate} from '@/utils'
import {getSessionData, removeSessionData, setSessionData} from '@/data'
import {Button} from 'antd'
import {removeToken} from '@/utils/auth'
import '@/public/css/modify-login-password.pcss';
import {modifyLoginPwd} from '@/api'
import Box from '@/component/common/ui/Box'
import Breadcrumb from '@/component/common/Breadcrumb'
import userPwdImg from '@/public/img/user_pwd.png'


class ModifyLoginPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            breadcrumbData: [{
                path: 'user.html',
                val: intl.get('personalCenter')
            }, {
                val: intl.get('Modify login password')
            }],
            errorMsg: ''
        }
    }

    componentDidMount() {

    }

    validate() {
        const resultOld = this.refs['oldPassword'].validate();
        const result1 = this.refs['newPassword'].validate()
        const result2 = this.refs['confirmPassword'].validate()
        if (result1 && result2 && resultOld) {
            if (this.refs['newPassword'].getValue() !== this.refs['confirmPassword'].getValue()) {
                this.setState({
                    errorMsg: intl.get('Different about the two new password')
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
            this.setState({
                loading: true
            });
            modifyLoginPwd({
                oldPassword: this.refs['oldPassword'].getValue(),
                newPassword: this.refs['newPassword'].getValue()
            }).then(response => {
                    this.setState({
                        loading: false,
                        errorMsg: ""
                    });
                    removeToken();
                    ui.tip({
                        msg: intl.get('Login password modify successfully'),
                        callback: () => {
                            jumpUrl('login.html')
                        }
                    })
                }, error => {
                    this.setState({
                        loading: false,
                        errorMsg: error
                    })
                })
        }
    }

    render() {
        return (
            <div className="modify-login-password-page">
                <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                <div className="modify-title">{intl.get('Modify login password')}</div>
                <div className="modify-content">
                    <div className="error-line">
                        {this.state.errorMsg}
                    </div>
                    <div className="clearfix modify-item">
                        <img src={userPwdImg} alt=""/>
                        <Box ref="oldPassword" type="password"
                             placeholder="Please enter old password"
                             validates={['notNull']}/>
                    </div>
                    <div className="clearfix modify-item">
                        <img src={userPwdImg} alt=""/>
                        <Box ref="newPassword" type="password"
                             placeholder="Please enter new password"
                             validates={['notNull', 'password']}/>
                    </div>
                    <div className="clearfix modify-item">
                        <img src={userPwdImg} alt=""/>
                        <Box ref="confirmPassword" type="password"
                             placeholder="Please confirm the new password"
                             validates={['notNull']}/>
                    </div>
                    <Button className="btn btn-confirm" key="submit" type="primary" loading={this.state.loading}
                            onClick={this.confirm.bind(this)}>{intl.get('confirmBtn')}</Button>
                </div>
            </div>
        );
    }
}

export default ModifyLoginPassword;