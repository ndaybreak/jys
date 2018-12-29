import React from 'react';
import intl from 'react-intl-universal'
import { Icon, Modal, Button } from 'antd'
import { jumpUrl, validate, getSearchPara } from '@/utils'
import { setSessionData, getSessionData, removeSessionData } from '@/data'
import '@/public/css/register.pcss';
import userImg from '@/public/img/用户名.png'
import passwordImg from '@/public/img/密码.png'
import recommendImg from '@/public/img/推荐人.png'
import checkedImg from '@/public/img/勾选.png'
import unCheckedImg from '@/public/img/未勾选.png'
import { getCodeForEmail, validateRegisterInfo } from '@/api'

const SEND_FLAG = 'isValidateCodeSend'
// let copyData = {}

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
            imageCode: '',
            codeErrorMsg: '',
            serverCode: '',
            invitedCode: '',
            isChecked: true
            // showValidatePage: false
        }
    }

    componentDidMount() {
        // if(getSearchPara('showValidatePage')) {
        //     copyData = getSessionData('registerInfo')
        //     this.setState({
        //         showValidatePage: true
        //     })
        // }
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
            validates: ['notNull', 'password']
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
        if(!this.state.isChecked && !errorMsg) {
            errorMsg = intl.get('platformProtocolTip')
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
            imageCode: e.target.value
        })
    }
    recommendChange(e) {
        this.setState({
            invitedCode: e.target.value
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
            this.register()
        }
    }
    codeKeyUp(e) {
        if(e.keyCode === 13) {
            this.getEmailCode()
        }
    }

    register() {
        if(this.validateAll()) {
            this.setState({
                modalVisible: true,
                imageCode: ''
            })
            this.changeCodeImg()
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

    getEmailCode() {
        if(!this.state.imageCode) {
            this.setState({
                codeErrorMsg: intl.get('notNullErrorMsg')
            })
        } else if(this.state.imageCode.toLowerCase() !== this.state.serverCode) {
            this.setState({
                codeErrorMsg: intl.get('captchaTip')
            })
        } else {
            this.setState({
                codeErrorMsg: '',
                loading: true
            })
            const para = {
                emailRegister: this.state.userName,
                imageCode: this.state.imageCode,
                password: this.state.password,
                invitedCode: this.state.invitedCode
            }

            validateRegisterInfo(para).then(res => {
                const copyData = {
                    email:  this.state.userName,
                    password: this.state.password,
                    invitedCode: this.state.invitedCode,
                    imageCode: this.state.imageCode
                }
                setSessionData('registerInfo', copyData)
                removeSessionData(SEND_FLAG)
                jumpUrl('validate-code.html', {
                    from: 'register'
                })
            }, error => {
                this.setState({
                    imageCode: '',
                    loading: false,
                    modalVisible: false,
                    errorMsg: error
                })
            })
        }
    }

    handleCancel() {
        this.setState({ modalVisible: false });
    }

    handleCheckBoxChange(e) {
        this.setState({
            isChecked: e.target.checked
        })
    }

    render() {
        return (
            <div>
                <div className="register-page">
                    <div className="title">{intl.get('welcomeRegister')}</div>
                    <div className="error-wrap">{this.state.errorMsg}</div>
                    {/*邮箱*/}
                    <div className="item-wrap username-wrap">
                        <img src={userImg} alt=""/>
                        <input className={'user-name ' + (this.state.isUserNameValid ? '' : 'error')} autoComplete="new-password" type="text" placeholder={intl.get('emailTip')}
                               value={this.state.userName} onChange={this.userNameChange.bind(this)}
                               onKeyUp={this.inputKeyUp.bind(this)} onBlur={this.userNameBlur.bind(this)}/>
                    </div>
                    {/*密码*/}
                    <div className="item-wrap password-wrap">
                        <img src={passwordImg} alt=""/>
                        <input  className={'password ' + (this.state.isPasswordValid ? '' : 'error')} autoComplete="new-password" type="password" placeholder={intl.get('passwordTip')}
                                value={this.state.password} onChange={this.passwordChange.bind(this)}
                                onKeyUp={this.inputKeyUp.bind(this)} onBlur={this.passwordBlur.bind(this)}/>
                    </div>
                    {/*推荐人*/}
                    <div className="item-wrap recommend-wrap">
                        <img src={recommendImg} alt=""/>
                        <input  className={'recommend'} autoComplete="new-password" type="text" placeholder={intl.get('referralId')}
                                value={this.state.invitedCode} onChange={this.recommendChange.bind(this)}
                                onKeyUp={this.inputKeyUp.bind(this)}/>
                    </div>
                    {/*协议*/}
                    <div className="checkbox-wrap">
                        <label style={{width: '30px', display: 'inline-block'}}>
                            <input type="checkbox" className="hide"
                                   checked={this.state.isChecked}
                                   onChange={this.handleCheckBoxChange.bind(this)}/>
                            {this.state.isChecked && (
                                <img src={checkedImg} alt=""/>
                            )}
                            {!this.state.isChecked && (
                                <img src={unCheckedImg} alt=""/>
                            )}
                        </label>
                        <span>{intl.get('readAndAgree')} <a className="protocol" href="protocol.html" target="_blank">《{intl.get('platformProtocol')}》</a></span>
                    </div>
                    <div className="item-wrap btn-wrap">
                        <button className="btn-login-big" onClick={this.register.bind(this)}>{intl.get('register')}</button>
                    </div>
                    <div className="item-wrap other-wrap">
                        {intl.get('existAccount')}<a className="login-link" href="login.html">{intl.get('loginNow')}</a>
                    </div>

                    {/*图形验证码*/}
                    <Modal
                        visible={this.state.modalVisible}
                        style={{ top: 232 }}
                        width='454px'
                        onCancel={this.handleCancel.bind(this)}
                        footer={[
                            <Button className="btn-login-submit" key="submit" type="primary" loading={this.state.loading} onClick={this.getEmailCode.bind(this)}>
                                {intl.get('submit')}
                            </Button>,
                        ]}
                    >
                        <div className="submit-wrap">
                            <div className="title">{intl.get('loginCodeTip')}</div>
                            <div className="submit-div">
                                <img src={this.state.codeImg} alt="" onClick={this.changeCodeImg.bind(this)} title={intl.get('clickRefresh')}/>
                                <input className="code-input" type="text" onKeyUp={this.codeKeyUp.bind(this)}
                                       value={this.state.imageCode} onChange={this.codeChange.bind(this)}/>
                            </div>
                            <div className="code-error">
                                {this.state.codeErrorMsg}
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Index;