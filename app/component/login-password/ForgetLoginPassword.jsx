import React from 'react';
import intl from 'react-intl-universal'
import {getSearchPara, isLangZH, jumpUrl, kebabCaseData2Camel, ui, validate} from '@/utils'
import {getSessionData, removeSessionData, setSessionData} from '@/data'
import {Button, Modal} from 'antd'
import '@/public/css/forget-login-password.pcss';
import {getCodeForEmail} from '@/api'
import Box from '@/component/common/ui/Box'
import Breadcrumb from '@/component/common/Breadcrumb'
import userPwdImg from '@/public/img/user_pwd.png'
import userEmail from '@/public/img/user_email.png'

const SEND_FLAG = 'isValidateCodeSend'

class ForgetLoginPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showImageCodeDialog: false,
            loading: false,
            breadcrumbData: [{
                path: 'login.html',
                val: intl.get('login')
            }, {
                val: intl.get('Forget password')
            }],
            errorMsg: '',
            codeImg: '',
            codeErrorMsg: '',
            serverCode: '',
            imageCode: ''
        }
    }

    componentDidMount() {

    }

    confirm() {
        const result = this.refs['email'].validate() && this.refs['newPassword'].validate();
        this.setState({
            loading: result
        })
        if (result) {
            this.changeCodeImg();
        }
    }

    jumpToDynamicCodePage() {
        if (!this.state.imageCode) {
            this.setState({
                codeErrorMsg: intl.get('notNullErrorMsg')
            })
        } else if (this.state.imageCode.toLowerCase() !== this.state.serverCode) {
            this.setState({
                codeErrorMsg: intl.get('captchaTip')
            })
        } else {
            setSessionData('forgetLoginPassword', {
                email: this.refs['email'].getValue(),
                password: this.refs['newPassword'].getValue(),
                imageCode: this.state.imageCode
            })
            removeSessionData(SEND_FLAG)
            jumpUrl('validate-code.html', {
                from: 'forget-login-password'
            })
        }
    }

    changeCodeImg() {
        getCodeForEmail({email: this.refs['email'].getValue()}).then(res => {
            this.setState({
                codeImg: 'data:image/png;base64,' + res.data.authCode,
                loading: false,
                showImageCodeDialog: true,
                serverCode: res.data.code.toLowerCase()
            })
        })
    }

    onChangeCode(e) {
        this.setState({
            imageCode: e.target.value.toLowerCase()
        })
    }

    handleCancel() {
        this.setState({showImageCodeDialog: false});
    }

    render() {
        return (
            <div className="forget-login-password-page">
                <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                <div className="modify-title">{intl.get('Set new login password')}</div>
                <div className="modify-content">
                    <div className="error-line">
                        {this.state.errorMsg}
                    </div>
                    <div className="clearfix modify-item">
                        <img src={userEmail} alt=""/>
                        <Box ref="email" type="email"
                             placeholder={intl.get('emailTip')}
                             validates={['notNull', 'email']}/>
                    </div>
                    <div className="clearfix modify-item">
                        <img src={userPwdImg} alt=""/>
                        <Box ref="newPassword" type="password"
                             placeholder={intl.get('Please set new login password')}
                             validates={['notNull', 'password']}/>
                    </div>
                    <Button className="btn btn-confirm btn-submit" key="submit" type="primary" loading={this.state.loading}
                            onClick={this.confirm.bind(this)}>{intl.get('confirmBtn')}</Button>
                </div>

                <Modal
                    visible={this.state.showImageCodeDialog}
                    style={{top: 232}}
                    width='454px'
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button className="btn-login-submit" key="submit" type="primary" loading={this.state.loading}
                                onClick={this.jumpToDynamicCodePage.bind(this)}>
                            {intl.get('submit')}
                        </Button>,
                    ]}
                >
                    <div className="submit-wrap">
                        <div className="title">{intl.get('loginCodeTip')}</div>
                        <div className="submit-div">
                            <img src={this.state.codeImg} alt="" onClick={this.changeCodeImg.bind(this)}
                                 title={intl.get('clickRefresh')}/>
                            <input className={'code-input ' + (this.state.codeErrorMsg ? 'error' : '')} type="text"
                                   onChange={this.onChangeCode.bind(this)}/>
                        </div>
                        <div className="code-error">
                            {this.state.codeErrorMsg}
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default ForgetLoginPassword;