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
// 验证码类型(1：更改手机或邮箱 2：注册 3：登陆（没有此功能暂时保留） 4：更改登陆密码 5：更改资金密码 6: 提现)
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
        data: {authenticationList: [para]}
    })
}
// 企业级用户认证保存
export function saveCompanyBasicAuthInfo(para) {
    return request({
        url: '/identity/saveEnterpriseBasicInformation',
        method: 'post',
        data: {authEnterpriseList: [para]}
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
// 保存用户认证图片信息
export function saveCompanyPicAuthInfo(para) {
    return request({
        url: '/identity/saveEnterpriseIdentity',
        method: 'post',
        data: {authEnterpriseList: [para]}
    })
}

// 查询用户认证信息
export function queryAuthInfo() {
    return request({
        url: '/identity/queryBasicInformation',
        method: 'post'
    })
}
// 查询用户认证信息
export function queryCompanyAuthInfo() {
    return request({
        url: '/identity/queryEnterpriseInformation',
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
            mobile: true,
            customerLevel:true,
            merchantLevel:true,
            agentLevel:true,
            icon:true,
            authApplicationStatus:true,
            type: true,
            isMoneyPassword: true,
            country: true,
            cantradeKyc: true
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
// 设置资金密码
export function setCapitalPwd(para) {
    return request({
        url: '/account/updateMoneyPasswordByEmail',
        method: 'post',
        params: para
    })
}
// 设置资金密码
export function getAuthVideoCode() {
    return request({
        url: '/identity/queryHeadingCode',
        method: 'post'
    })
}
// 资产变动日志
export function getCoinAssetLog(para) {
    return request({
        url: '/coinAssetLog/getListByCustomer',
        method: 'get',
        params: para
    })
}
// 查询币币交易币种
export function getCoin2CoinList() {
    return request({
        url: '/targetMarketCoin/public/getMarketTargetCoinListByCustomer',
        method: 'get'
    })
}
// 添加或更新支付方式
export function saveOrUpdatePayAccountInfo(para) {
    return request({
        url: '/pay/saveOrUpdatePayAccountInfo',
        method: 'post',
        params: para
    })
}
// 银行卡列表(同时也可检验对应的法币是否有绑定银行卡)
export function getBankList(id) {
    return request({
        url: '/pay/getPayAccountInfo',
        method: 'get',
        params: {
            coinId: id
        }
    })
}
// 删除银行卡
export function deleteBank(para) {
    return request({
        url: '/pay/delPayAccount',
        method: 'post',
        params: para
    })
}
// 法币提现
export function legalWithdraw(para) {
    return request({
        url: '/withdrawCash/withdraw',
        method: 'post',
        params: para
    })
}
// 法币提现记录
export function getLegalWithdrawRecord(para) {
    return request({
        url: '/withdrawCash/getWithdrawList',
        method: 'get',
        params: para
    })
}

// 法币充值记录
export function getLegalRechargeRecord(para) {
    return request({
        url: '/rechargeCash/getRechargeList',
        method: 'get',
        params: para
    })
}

// 法币充值账号列表
export function getRechargeAccountList() {
    return request({
        url: '/company/public/bankAccountInfo',
        method: 'post'
    })
}
// 法币充值
export function legalRecharge(para) {
    return request({
        url: '/rechargeCash/recharge',
        method: 'post',
        params: para
    })
}
// 法币充值提现配置项
export function getLegalConfigInfo(para) {
    return request({
        url: '/withdrawCash/getRechargeOrWithdrawLimit',
        method: 'get',
        params: para
    })
}
// 问卷调查考题
export function getQuestions(para) {
    return request({
        url: '/kyc/getAllQuestions',
        method: 'get'
    })
}
// 问卷调查考题
export function answerQuestions(data) {
    return request({
        url: '/kyc/answerMoreQuestion',
        method: 'post',
        data: {list: data}
    })
}
// 数字币充值
export function vcRecharge(data) {
    return request({
        url: '/rechargeCash/saveRecharge',
        method: 'post',
        params: data
    })
}

// 修改登录密码
export function modifyLoginPwd(para) {
    return request({
        url: '/account/updatePassword',
        method: 'post',
        params: para
    })
}

// 重置登录密码
export function resetLoginPwd(para) {
    return request({
        url: '/account/public/resetPasswordByEmail',
        method: 'post',
        params: para
    })
}

// 根据手机号获取验证码
export function getVerifyCodeByPhone(para) {
    return request({
        url: '/account/public/sendSmsVerificationCode',
        method: 'get',
        params: para
    })
}

// 设置手机号码
export function setPhoneToServer(para) {
    return request({
        url: '/account/bindingMobile',
        method: 'post',
        params: para
    })
}

// 修改手机号码
export function modifyPhoneToServer(para) {
    return request({
        url: '/account/changeMobile',
        method: 'post',
        params: para
    })
}

// 设置邮箱
export function modifyEmailToServer(para) {
    return request({
        url: '/account/changeEmail',
        method: 'post',
        params: para
    })
}

// 检查敏感信息是否有修改(登录密码、资金密码、邮箱)；只针对提现。
export function isSensitiveInfoChange() {
    return request({
        url: '/withdrawCash/isAllowWithdraw',
        method: 'get'
    })
}
// 检查允许删除支付账号
export function isAllowDelPayAccountInfo(id) {
    return request({
        url: '/pay/isAllowDelPayAccountInfo',
        method: 'get',
        params: { id }
    })
}
// 检查图形验证码的正确性
// email的使用情况（登录、注册、忘记密码）
export function isCodeCorrect(code, email) {
    return request({
        url: '/verification/account/getCodeForToken',
        method: 'get',
        params: {
            code: code,
            email: email
        }
    })
}
// 查看账号权限
export function getAccountPermission(coinId) {
    return request({
        url: '/account/getAccountPermission',
        method: 'get',
        params: {
            isMoneyPassword: true,
            authApplicationStatus: true,
            cantradeKyc: true,
            coinId: coinId
        }
    })
}
// 提现确认时的检查
export function checkWithdraw(query) {
    return request({
        url: '/withdrawCash/checkWithdraw',
        method: 'get',
        params: query
    })
}