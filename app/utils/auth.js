import Cookies from 'js-cookie'
import intl from 'react-intl-universal'
import { getAccountInfo } from '@/api'
import { ui, jumpUrl } from '@/utils'

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
    return JSON.parse(Cookies.get(UserKey))
}
function setUser(user) {
    user.isAuth = user.auth_application_status === 2 // 未提交0，拒绝1，审核通过2 ,审核中3
    user.hasMoneyPwd = !!user.is_money_password
    Cookies.set(UserKey, user)
}
function removeUser() {
    return Cookies.remove(UserKey)
}

// list: auth questionnaire capitalPassword
export function checkAuth(list = []) {
    const user = getUser()

    // 注册审核是否完成
    if(list.indexOf('auth') > -1 && !user.isAuth) {
        ui.tip({
            width: 310,
            msg: 'Your account has no transaction/withdrawl/depoist authority yet.'
        })
        return false
    }

    // 问卷调查是否完成
    if(list.indexOf('questionnaire') > -1 && !user.cantrade_kyc) {
        ui.confirm({
            width: 300,
            msg: 'In order to ensure the appropriateness of product or service sales and protect investors\'rights and interests, you need to do an investment knowledge assessment.',
            onOk: () => {
                jumpUrl('register-questionnaire.html')
            }
        })
        return false
    }

    // 资金密码是否设置
    if(list.indexOf('capitalPassword') > -1 && !user.hasMoneyPwd) {
        ui.confirm({
            msg: intl.get('notSetCapitalPassword'),
            onOk: () => {
                jumpUrl('set-capital-password.html')
            }
        })
        return false
    }

    return true
}