import request from '@/utils/request'
import { kebabCaseData2Camel, isLangZH } from '@/utils'

// page--首页
// 获取推荐币种
export function getRecommendCoins() {
    return request({
        url: '/recommend/public/getRecommendCoinList',
        method: 'get'
    })
}

// page--规则
// 获取费率
export function getRates() {
    return request({
        url: '/coinFeeRate/public/getWithdrawInfo',
        method: 'get'
    })
}

// page--帮助中心
// 获取全部分类
export function getCategorys() {
    return request({
        url: '/managementSystem/public/queryHelpCenterWEB',
        method: 'post'
    })
}
// page--帮助中心
// 获取帮助详情
export function getHelpDetail(id) {
    return request({
        url: '/managementSystem/public/queryHelpContentByid',
        method: 'post',
        params: { id }
    })
}

// page--帮助中心
// 搜索
export function getHelpSearch(content, currPage) {
    return request({
        url: '/managementSystem/public/queryHelpCenterWhereInfo',
        method: 'post',
        params: {
            content: content,
            currPage: currPage,
            pageSize: 5
        }
    })
}

// page--新闻公告
// 获取全部分类
export function getNewsCategorys() {
    return request({
        url: '/managementSystem/public/queryNewsCenterCatelogWEB',
        method: 'get'
    })
}

// page--新闻公告
// 获取新闻公告详情
export function getNewsDetail(id) {
    return request({
        url: '/managementSystem/public/queryNewsCenterByid',
        method: 'post',
        params: { id }
    })
}

// page--新闻公告
// 搜索
export function getNewsSearch(content, currPage) {
    return request({
        url: '/managementSystem/public/queryNewsCenterWhereInfo',
        method: 'post',
        params: {
            content: content,
            currPage: currPage,
            pageSize: 5
        }
    })
}

// 邮箱图形验证码
export function getCodeForEmail(params) {
    return request({
        url: '/verification/public/getCodeForEmail',
        method: 'get',
        params: Object.assign({
            number: 4,
            width: 96,
            height: 41
        }, params)
    })
}

// 邮箱登录
export function loginByEmail(params) {
    return request({
        url: '/account/public/loginByEmail',
        method: 'post',
        params: params
    })
}

// 获取邮箱验证码
export function sendEmailValidateCode(email, type) {
    return request({
        url: '/account/public/sendEmailVerificationCode',
        method: 'get',
        params: {
            type: type,
            email: email
        }
    })
}

// 校验注册信息
export function validateRegisterInfo(params) {
    return request({
        url: '/account/public/verifyAccount',
        method: 'post',
        params: params
    })
}

// 邮箱注册
export function registerByEmail(params) {
    return request({
        url: '/account/public/registerByEmail',
        method: 'post',
        params: params
    })
}

// 获取国家或地区
export function getCountryList() {
    return request({
        url: '/countryArea/public/queryAllByCustomer',
        method: 'get',
        params: {
            lang: isLangZH() ? 0 : 1
        }
    })
}

// 保存用户认证基本信息
export function saveBasicAuthInfo(para) {
    return request({
        url: '/identity/saveBasicInformation',
        method: 'post',
        params: para
    })
}

// 保存用户认证图片信息
export function savePicAuthInfo(para) {
    return request({
        url: '/identity/saveIdentityAuthentication',
        method: 'post',
        params: para
    })
}

// 查询用户认证信息
export function queryAuthInfo() {
    return request({
        url: '/identity/queryBasicInformation',
        method: 'post'
    })
}

// 退出
export function logout() {
    return request({
        url: '/account/logout',
        method: 'post'
    })
}

// 经纪人分佣
export function getCommissionList() {
    return request({
        url: '/commission/getCommissionList',
        method: 'get'
    })
}

// 获取用户资产列表
export function getAssetList() {
    return request({
        url: '/coinAsset/getAssetList',
        method: 'get'
    })
}
// 查看用户信息
export function getAccountInfo(para) {
    return request({
        url: '/account/getAccountInfo',
        method: 'get',
        params: Object.assign({
            email:true,
            customerLevel:true,
            merchantLevel:true,
            agentLevel:true,
            icon:true,
            authApplicationStatus:true
        }, para)
    })
}
// 查询币币交易委托订单
export function getEntrustmentList(para) {
    return request({
        url: '/trade/getEntrustmentList',
        method: 'get',
        params: {
            isToDay: para.isToDay,
            startTime: para.startTime,
            endTime: para.endTime,
            currPage: 1,
            pageSize: 9999999
        }
    })
}
// 查询交易限制参数
export function getTradeLimitParameter(base, target) {
    return request({
        url: '/trade/public/getTradeLimitParameter',
        method: 'get',
        params: {
            marketCoinCode: target,
            targetCoinCode: base
        }
    })
}
// 币币委托交易
export function entrustmentTrade(para) {
    return request({
        url: '/trade/entrustmentTrade',
        method: 'post',
        params: para
    })
}
// 币币交易 撤单
export function cancelCoinsOrder(id) {
    return request({
        url: '/trade/cancelOrder',
        method: 'post',
        params: {
            id
        }
    })
}
// 获取数字币
export function getCoinList(para) {
    return request({
        url: '/coin/public/getDropdownList',
        method: 'get',
        params: para
    })
}
// 获取充值地址
export function getRechargeAddress(coinId) {
    return request({
        url: '/rechargeAddress/getAddress',
        method: 'get',
        params: {
            coinId
        }
    })
}
// 获取提现地址
export function getWithdrawAddress(coinId) {
    return request({
        url: '/withdrawAddress/getAddressListByCustomer',
        method: 'get',
        params: {
            coinId
        }
    })
}
// 获取提现基本信息
export function getWithdrawInfo(coinId) {
    return request({
        url: '/withdrawCash/getBaseInfo',
        method: 'get',
        params: {
            coinId
        }
    })
}
// 发出提现申请
export function withdrawApplication(para) {
    return request({
        url: '/withdrawCash/application',
        method: 'post',
        params: para
    })
}
// 意见反馈
export function saveFeedback(para) {
    return request({
        url: '/feedback/saveFeedback',
        method: 'post',
        params: para
    })
}
// 身份认证途径列表
export function getAuthTypeList() {
    return request({
        url: '/identity/queryAuthPathway',
        method: 'post',
        params: {
            currPage: 1,
            pageSize: 100
        }
    })
}
