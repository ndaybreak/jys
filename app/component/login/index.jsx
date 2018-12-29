import React from 'react';
import intl from 'react-intl-universal'
import { Icon, Modal, Button } from 'antd'
import { setToken } from '@/utils/auth'
import { jumpUrl, validate, getSearchPara } from '@/utils'
import '@/public/css/login.pcss';
import userImg from '@/public/img/用户名.png'
import passwordImg from '@/public/img/密码.png'
import { getCodeForEmail, loginByEmail } from '@/api'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            errorMsg: '',
            isUserNameValid: true,
            isPasswordValid: true,
            loading: false,
            modalVisible: false,
            codeImg: '',
            code: '',
            codeErrorMsg: '',
            serverCode: ''
        }
    }

    componentWillMount() {

    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    validateEmail() {
        return validate({
            name: intl.get('email'),
            value: this.state.userName,
            validates: ['notNull', 'email']
        })
    }
    validatePassword() {
        return validate({
            name: intl.get('password'),
            value: this.state.password,
            validates: ['notNull']
        })
    }
    validateAll() {
        let errorMsg = ''
        const emailResult = this.validateEmail()
        if(!emailResult.pass) {
            errorMsg = emailResult.msg
        }
        const pwdResult = this.validatePassword()
        if(!pwdResult.pass && !errorMsg) {
            errorMsg = pwdResult.msg
        }
        
        this.setState({
            isUserNameValid: emailResult.pass ? true : false,
            isPasswordValid: pwdResult.pass ? true : false,
            errorMsg: errorMsg
        })
        
        return !errorMsg
    }

    userNameChange(e) {
        this.setState({
            userName: e.target.value
        })
    }

    passwordChange(e) {
        this.setState({
            password: e.target.value
        })
    }
    codeChange(e) {
        this.setState({
            code: e.target.value
        })
    }

    userNameBlur(e) {
        const result = this.validateEmail()
        if(result.pass) {
            this.setState({
                isUserNameValid: true,
                errorMsg: ''
            })
        } else {
            this.setState({
                isUserNameValid: false,
                errorMsg: result.msg
            })
        }
    }
    passwordBlur(e) {
        const result = this.validatePassword()
        if(result.pass) {
            this.setState({
                isPasswordValid: true,
                errorMsg: ''
            })
        } else {
            this.setState({
                isPasswordValid: false,
                errorMsg: result.msg
            })
        }
    }
    inputKeyUp(e) {
        if(e.keyCode === 13) {
            this.login()
        }
    }
    codeKeyUp(e) {
        if(e.keyCode === 13) {
            this.loginSubmit()
        }
    }

    login() {
        if(this.validateAll()) {
            this.setState({
                modalVisible: true,
                code: '',
                codeErrorMsg: ''
            })
            getCodeForEmail({ email: this.state.userName }).then(res => {
                this.setState({
                    codeImg: 'data:image/png;base64,' + res.data.authCode,
                    serverCode: res.data.code.toLowerCase()
                })
            })
        }
    }
    changeCodeImg() {
        getCodeForEmail({ email: this.state.userName }).then(res => {
            this.setState({
                codeImg: 'data:image/png;base64,' + res.data.authCode,
                serverCode: res.data.code.toLowerCase()
            })
        })
    }
    loginSubmit() {
        if(!this.state.code) {
            this.setState({
                codeErrorMsg: intl.get('notNullErrorMsg')
            })
        } else if(this.state.code.toLowerCase() !== this.state.serverCode) {
            this.setState({
                codeErrorMsg: intl.get('captchaTip')
            })
        } else {
            this.setState({
                codeErrorMsg: '',
                loading: true
            })
            const para = {
                email: this.state.userName,
                imageCode: this.state.code,
                password: this.state.password
            }
            loginByEmail(para).then(res => {
                this.setState({
                    loading: false,
                    modalVisible: false
                })
                setToken(res.data.token).then(res => {
                    if(getSearchPara('from')) {
                        jumpUrl(getSearchPara('from') + '.html')
                    } else {
                        jumpUrl('index.html')
                    }
                })
            }, errorInfo => {
                this.setState({
                    loading: false,
                    modalVisible: false,
                    errorMsg: errorInfo
                })
            })
        }
    }
    handleCancel() {
        this.setState({ modalVisible: false });
    }

    render() {
        return (
            <div className="login-page">
                <div className="title">{intl.get('welcomeLogin')}</div>
                <div className="error-wrap">{this.state.errorMsg}</div>
                <div className="item-wrap username-wrap">
                    <img src={userImg} alt=""/>
                    <input className={'user-name ' + (this.state.isUserNameValid ? '' : 'error')} autoComplete="new-password" type="text" placeholder={intl.get('emailTip')}
                           value={this.state.userName} onChange={this.userNameChange.bind(this)}
                           onKeyUp={this.inputKeyUp.bind(this)} onBlur={this.userNameBlur.bind(this)}/>
                </div>
                <div className="item-wrap password-wrap">
                    <img src={passwordImg} alt=""/>
                    <input  className={'password ' + (this.state.isPasswordValid ? '' : 'error')} autoComplete="new-password" type="password" placeholder={intl.get('passwordTip')}
                            value={this.state.password} onChange={this.passwordChange.bind(this)}
                            onKeyUp={this.inputKeyUp.bind(this)} onBlur={this.passwordBlur.bind(this)}/>
                </div>
                <div className="item-wrap btn-wrap">
                    <button className="btn-login-big" onClick={this.login.bind(this)}>{intl.get('login')}</button>
                </div>
                <div className="item-wrap other-wrap">
                    <a className="register-link" href="register.html">{intl.get('register')}</a>
                    <a className="forget-link" href="forget.html">{intl.get('forgetPwd')}</a>
                </div>

                <Modal
                    visible={this.state.modalVisible}
                    style={{ top: 232 }}
                    width='454px'
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button className="btn-login-submit" key="submit" type="primary" loading={this.state.loading} onClick={this.loginSubmit.bind(this)}>
                            {intl.get('submit')}
                        </Button>,
                    ]}
                >
                    <div className="submit-wrap">
                        <div className="title">{intl.get('loginCodeTip')}</div>
                        <div className="submit-div">
                            <img src={this.state.codeImg} alt="" onClick={this.changeCodeImg.bind(this)} title={intl.get('clickRefresh')}/>
                            <input className={'code-input ' + (this.state.codeErrorMsg ? 'error' : '')} type="text" onKeyUp={this.codeKeyUp.bind(this)}
                                   value={this.state.code} onChange={this.codeChange.bind(this)}/>
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

export default Index;