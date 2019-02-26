import React from 'react'
import ReactDOM from 'react-dom'
import {Modal, Button, Spin} from "antd/lib/index"
import Cookies from 'js-cookie'
import intl from 'react-intl-universal'
import { getAccountInfo, getAccountPermission } from '@/api'
import { ui, jumpUrl, isJson } from '@/utils'
import passIcon from '@/public/img/icon_auth_pass.png'

const TokenKey = 'stoxToken'
const UserKey = 'stoxUser'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return new Promise((resolve, reject) => {
        let cookie = Cookies.set(TokenKey, token)
        getAccountInfo().then(res => {
            setUser(res.data)
            resolve(cookie)
        })
    })
}

export function refreshAccountInfo() {
    return new Promise((resolve, reject) => {
        getAccountInfo().then(res => {
            setUser(res.data)
            resolve()
        })
    })
}

export function removeToken() {
    removeUser()
    return Cookies.remove(TokenKey)
}

export function getUser() {
    const user = Cookies.get(UserKey)
    if(isJson(user)) {
        return JSON.parse(user)
    } else {
        jumpUrl('index.html')
    }
}
function setUser(user) {
    user.isAuth = user.auth_application_status === 2 // 未提交0，拒绝1，审核通过2 ,审核中3
    user.hasMoneyPwd = !!user.is_money_password
    Cookies.set(UserKey, user)
}
function removeUser() {
    return Cookies.remove(UserKey)
}

function showAuthResult(para, result) {
    const user = getUser()
    function goAuth() {
        if(user.type == 1) {
            jumpUrl('auth.html')
        } else {
            jumpUrl('auth-corporate.html')
        }
    }
    function goTest() {
        jumpUrl('register-questionnaire.html')
    }
    function goBindCard() {
        jumpUrl('bank-add.html')
    }
    function goSetPwd() {
        jumpUrl('set-capital-password.html')
    }
    function Content() {
        return (
            <div className="auth-result">
                <div className="auth-item clearfix">
                    <div className="auth-label">Pass KYC certification</div>
                    <div className="auth-value">
                        {(result.auth_application_status === 0 || result.auth_application_status === 1) && (
                            <button className="btn btn-auth" onClick={goAuth}>KYC</button>
                        )}
                        {result.auth_application_status === 3 && (
                            <span>Verifying</span>
                        )}
                        {result.auth_application_status === 2 && (
                            <img src={passIcon} alt=""/>
                        )}
                    </div>
                </div>
                {para.isTrade && (
                    <div className="auth-item clearfix">
                        <div className="auth-label">investment knowledge assessment</div>
                        <div className="auth-value">
                            {!result.cantrade_kyc && (
                                <button className="btn btn-auth" onClick={goTest}>Test</button>
                            )}
                            {result.cantrade_kyc && (
                                <img src={passIcon} alt=""/>
                            )}
                        </div>
                    </div>
                )}
                {para.isFiat && (
                    <div className="auth-item clearfix">
                        <div className="auth-label">Binding a bank account</div>
                        <div className="auth-value">
                            {result.bindCardStatus === -1 && (
                                <button className="btn btn-auth" onClick={goBindCard}>Bind</button>
                            )}
                            {(result.bindCardStatus === 0 || result.bindCardStatus === 2) && (
                                <span>verifying</span>
                            )}
                            {result.bindCardStatus === 3 && (
                                <img src={passIcon} alt=""/>
                            )}
                        </div>
                    </div>
                )}
                <div className="auth-item clearfix">
                    <div className="auth-label">Set up the capital password</div>
                    <div className="auth-value">
                        {!result.is_money_password && (
                            <button className="btn btn-auth" onClick={goSetPwd}>Set</button>
                        )}
                        {result.is_money_password && (
                            <img src={passIcon} alt=""/>
                        )}
                    </div>
                </div>
            </div>
        )
    }
    const obj = {
        title: 'You need to do the following first:',
        className: 'sto-modal-simple-confirm auth-modal',
        content: <Content/>,
        width: 500,
        centered: true,
        maskClosable: true
    }
    Modal.confirm(obj);
}

/**
 * params{
 *  isTrade: 是否交易,
 *
 *  isFiat: 是否是法币,
 *
 *  isDeposit: 是否充值,
 *  isWithdraw: 是否提现,
 *  coinId: 币种ID
 *  }
 * */
export function checkAuth(para = {}) {
    return new Promise(resolve => {
        getAccountPermission(para.coinId).then(res => {
            const result = res.data
            if(result.auth_application_status === 2 && result.is_money_password) {
                if(para.isTrade) {
                    if(result.cantrade_kyc) {
                        resolve()
                    } else {
                        showAuthResult(para, result)
                    }
                } else if(para.isFiat) {
                    // bindCardStatus -1：未绑卡  0：审核中  2：未通过 3：通过
                    if((para.isDeposit && result.bindCardStatus !== -1 && result.bindCardStatus !== 2) ||
                        (para.isWithdraw && result.bindCardStatus === 3)) {
                        resolve()
                    } else {
                        showAuthResult(para, result)
                    }
                } else {
                    resolve()
                }
            } else {
                showAuthResult(para, result)
            }
        })
    })


    // const user = getUser()
    //
    // let list = []
    // // 注册审核是否完成
    // if(list.indexOf('auth') > -1 && !user.isAuth) {
    //     ui.tip({
    //         width: 310,
    //         msg: 'Your account has not been verified, no transactions are available yet.'
    //     })
    //     return false
    // }
    //
    // // 问卷调查是否完成
    // if(list.indexOf('questionnaire') > -1 && !user.cantrade_kyc) {
    //     ui.confirm({
    //         width: 300,
    //         msg: 'In order to ensure the appropriateness of product or service sales and protect investors\'rights and interests, you need to do an investment knowledge assessment.',
    //         onOk: () => {
    //             jumpUrl('register-questionnaire.html')
    //         }
    //     })
    //     return false
    // }
    //
    // // 资金密码是否设置
    // if(list.indexOf('capitalPassword') > -1 && !user.hasMoneyPwd) {
    //     ui.confirm({
    //         msg: intl.get('notSetCapitalPassword'),
    //         onOk: () => {
    //             jumpUrl('set-capital-password.html')
    //         }
    //     })
    //     return false
    // }
    //
    // return true
}