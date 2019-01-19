import React from 'react';
import intl from 'react-intl-universal'
import { Icon, Modal, Button, Upload, message, Spin } from 'antd'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH } from '@/utils'
import { setSessionData } from '@/data'
import '@/public/css/user.pcss';
import userIconImg from '@/public/img/user_icon.png'
import userLevel1Img from '@/public/img/user_level_1.png'
import userLevel2Img from '@/public/img/user_level_2.png'
import userLevel3Img from '@/public/img/user_level_3.png'
import merchantLevelCommonImg from '@/public/img/user_merchant_common.png'
import merchantLevelHighImg from '@/public/img/user_merchant_high.png'
import userPwdImg from '@/public/img/user_pwd.png'
import userPhoneImg from '@/public/img/user_phone.png'
import userBankImg from '@/public/img/user_bank.png'
import userEmailImg from '@/public/img/user_email.png'
import userRecommendImg from '@/public/img/user_recommend.png'
import userAssetImg from '@/public/img/user_asset.png'
import { getCommissionList, getAssetList, getCoinAssetLog, getCoinList, getBankList } from '@/api'
import { getUser, checkAuth } from '@/utils/auth'
import { getPriceBtcQuot, getTargetPairsQuot } from '@/api/quot'
import AssetDetails from './AssetDetails'

const user = getUser()

const getUserLevelImg = (level) => {
    const imgs = [userLevel1Img, userLevel2Img, userLevel3Img]
    return imgs[level - 1]
}
const getMerchantLevelImg = (level) => {
    const imgs = ['', merchantLevelCommonImg, merchantLevelHighImg]
    return imgs[level]
}

const getBtcTotalPrice = (priceList, assetObj) => {
    let sum = 0
    priceList.forEach(item => {
        sum += assetObj[item.coinCode] * item.price
    })
    return sum
}

const getAssets = (data) => {
    const resultFiat = []
    const resultVC = []
    data.forEach(item => {
        if(item.isVC === 1) {
            resultVC.push(item)
        } else if(item.isVC === 2) {
            resultFiat.push(item)
        }
    })
    return [resultVC, resultFiat]
}

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userLevelImg: '',
            merchantLevelImg: merchantLevelCommonImg,
            assetList: [],
            legalAssetList: [],
            totalBtc: '',
            total: '',
            detailsVisible: false
        }
    }

    componentDidMount() {
        getCommissionList().then(res => {
            this.setState({
                recommendId: res.data.invitationCode,
                recommendFriends: res.data.invitationNum,
                recommendValue: res.data.valuation
            })
        })

        // 获取资产列表 》获取每种数字币对应的btc价格 》btc价格转化为人民币
        getAssetList().then(res => {
            let asset = getAssets(res.data)
            this.setState({
                assetList: asset[0],
                legalAssetList: asset[1]
            })
            return Promise.resolve(res.data)
        })
        //     .then(assetList => {
        //     return new Promise((resolve, reject) => {
        //         const assetObj = {}
        //         const codeList = []
        //         assetList.forEach(item => {
        //             codeList.push(item.coin_code)
        //             assetObj[item.coin_code] = item.total_balance
        //         })
        //         getPriceBtcQuot(codeList, priceList => {
        //             const totalBtc = getBtcTotalPrice(priceList, assetObj)
        //             this.setState({
        //                 totalBtc: totalBtc.toFixed(8) || 0
        //             })
        //             resolve(totalBtc)
        //         })
        //     })
        // })
            .then((totalBtc) => {
            let para = {
                // isOnce: true
            }
            para.targetPairs = [{
                targetCoinCode: 'BTC',
                mainCoinCode: 'USDT'
            }]
            // getTargetPairsQuot(para, data => {
            //     let value = 0
            //     if(isLangZH()) {
            //         value = '￥ ' + (totalBtc * data[0].rmbPrice).toFixed(2)
            //     } else {
            //         value = '$ ' + (totalBtc * data[0].legalTenderPrice).toFixed(2)
            //     }
            //     value = '$ ' + (totalBtc * data[0].legalTenderPrice).toFixed(2)
            //
            //     this.setState({
            //         total: value
            //     })
            // })
        })
        this.setState({
            userLevelImg: getUserLevelImg(user.customer_level),
            merchantLevelImg: getMerchantLevelImg(user.merchant_level)
        })
    }

    goAuth(isVerifying, e) {
        if(isVerifying) {
            ui.tip({
                width: 300,
                msg: 'Your KYC information is under review. Please wait patiently.  '
            })
            return
        }
        if(user.type == 1) {
            jumpUrl('auth.html')
        } else {
            jumpUrl('auth-corporate.html')
        }
    }

    showLevel() {
        this.setState({
            visible: true
        })
    }

    levelCancel() {
        this.setState({
            visible: false
        })
    }

    openModifyPage(page) {
        if(page === 'capitalPassword') {
            jumpUrl('set-capital-password.html')
        } else if(page === 'modifyLoginPassword') {
            jumpUrl('modify-login-password.html');
        }
    }

    modifyPhone() {
        if (user.mobile_number) {
            jumpUrl('verify-old-phone.html');
        } else {
            setSessionData('nextPageName', 'modify-phone');
            jumpUrl('validate-code.html', {'from': 'user'});
        }
    }

    modifyEmail() {
        jumpUrl('verify-old-email.html');
    }

    goDesposit(item) {
        if(!checkAuth(['auth', 'capitalPassword'])) {
            return
        }
        jumpUrl('recharge.html', {
            id: item.id,
            code: item.coin_code
        })
    }

    goWithdrawal(item) {
        if(!checkAuth(['auth', 'capitalPassword'])) {
            return
        }
        jumpUrl('withdraw.html', {
            id: item.id,
            code: item.coin_code
        })
    }
    goLegalDesposit(item) {
        if(!checkAuth(['auth', 'capitalPassword'])) {
            return
        }
        getBankList(item.id).then(res => {
            if(!res.data.length) {
                ui.confirm({
                    msg: 'You need to bind an available bank account first. ',
                    onOk: () => {
                        jumpUrl('bank-add.html')
                    }
                })
            } else if(res.data.every(item => {
                return item.state === 0
            })) {
                ui.tip({
                    msg: 'Your bank account information is under review. Please wait patiently. '
                })
            } else {
                jumpUrl('legal-recharge.html', {
                    id: item.id,
                    code: item.coin_code
                })
            }
        })
    }

    goLegalWithdrawal(item) {
        if(!checkAuth(['auth', 'capitalPassword'])) {
            return
        }
        getBankList(item.id).then(res => {
            if(!res.data.length) {
                ui.confirm({
                    msg: 'You need to bind an available bank account first. ',
                    onOk: () => {
                        jumpUrl('bank-add.html')
                    }
                })
            } else if(res.data.every(item => {
                return item.state === 0
            })) {
                ui.tip({
                    msg: 'Your bank account information is under review. Please wait patiently. '
                })
            } else {
                jumpUrl('legal-withdraw.html', {
                    id: item.id,
                    code: item.coin_code
                })
            }
        })
    }

    showVariationDetails() {
        this.setState({
            detailsVisible: true
        })
    }

    handleDetailsClose() {
        this.setState({
            detailsVisible: false
        })
    }

    bindBank() {
        jumpUrl('bank-list.html')
    }

    render() {
        const { userLevelImg, merchantLevelImg, isMerchant } = this.state

        return (
            <div className="user-page">
                <div className="user-info">
                    <div className="user-info-inner">
                        <div className="info-left">
                            <img src={userIconImg} alt=""/>
                            <span>{user.email}</span>
                            <img className="user-level" src={userLevelImg} alt="" onClick={this.showLevel.bind(this)}/>
                            {/*{user.is_merchant && (*/}
                                {/*<img src={merchantLevelImg} alt=""/>*/}
                            {/*)}*/}
                            {user.auth_application_status === 2 && (
                                <button className="btn btn-authed">{intl.get('verified')}</button>
                            )}
                            {!user.auth_application_status && (
                                <button className="btn btn-auth" onClick={this.goAuth.bind(this, false)}>{intl.get('toVerified')}</button>
                            )}
                            {user.auth_application_status === 3 && (
                                <button className="btn btn-auth" onClick={this.goAuth.bind(this, true)}>{intl.get('verifying')}</button>
                            )}
                            {/*{user.is_merchant && (*/}
                                {/*<button className="btn btn-agent">{intl.get('merchantCorner')}</button>*/}
                            {/*)}*/}
                        </div>
                        <div className="info-right">
                            <div className="asset-line">
                                {/*{intl.get('myFunds')}*/}
                                <a className="info-link link-detail" href="javascript:" onClick={this.showVariationDetails.bind(this)}>Variation my assets details</a>
                                {/*<a className="info-link link-recharge" href="recharge.html">{intl.get('deposit')}</a>*/}
                                {/*<a className="info-link" href="withdraw.html">{intl.get('withdrawal')}</a>*/}
                            </div>
                            {/*<div>*/}
                                {/*{intl.get('estimatedValue')}:*/}
                                {/*/!*{this.state.totalBtc} BTC*!/*/}
                                {/*<span className="legal-value">{this.state.total}</span>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
                <div className="user-content">
                    <div className="title">{intl.get('setting')}</div>
                    <div className="clearfix">
                        <div className="content-item item-left">
                            <img src={userPwdImg} alt=""/>
                            <span>{intl.get('loginPwd')}</span>
                            <button className="btn btn-primary btn-update" onClick={this.openModifyPage.bind(this, 'modifyLoginPassword')}>{intl.get('modify')}</button>
                        </div>
                        <div className="content-item">
                            <img src={userPwdImg} alt=""/>
                            <span>{intl.get('capitalPassword')}</span>
                            <button className="btn btn-primary btn-update" onClick={this.openModifyPage.bind(this, 'capitalPassword')}>{user.hasMoneyPwd ? 'Reset' : 'Add'}</button>
                        </div>
                    </div>
                    <div className="clearfix">
                        {/*<div className="content-item item-left">*/}
                            {/*<img src={userPhoneImg} alt=""/>*/}
                            {/*<span>{intl.get('bindPhone')}</span>*/}
                            {/*<button className="btn btn-primary btn-update"*/}
                                    {/*onClick={this.modifyPhone.bind(this)}>{user.info ? intl.get('modify') : 'Add'}</button>*/}
                        {/*</div>*/}
                        <div className="content-item item-left">
                            <img src={userBankImg} alt=""/>
                            <span>Bank Accounts</span>
                            <button className="btn btn-primary btn-update" onClick={this.bindBank.bind(this)}>Edit</button>
                        </div>
                        <div className="content-item">
                            <img src={userEmailImg} alt=""/>
                            <span>{intl.get('bindEmail')}</span>
                            <button className="btn btn-primary btn-update" onClick={this.modifyEmail.bind(this)}>{intl.get('modify')}</button>
                        </div>
                    </div>

                    <div className="title">{intl.get('referralRebate')}</div>
                    <div className="clearfix">
                        <div className="content-item recommend-left">
                            <span className="recommend-label">{intl.get('myReferralId')}:</span>
                            <span className="recommend-value">{this.state.recommendId}</span>
                        </div>
                        <div className="content-item">
                            <img src={userRecommendImg} alt=""/>
                            <span className="recommend-label">{intl.get('download_5')}:</span>
                            <span className="recommend-value">{this.state.recommendFriends}</span>
                        </div>
                        {/*<div className="content-item recommend-item">*/}
                            {/*<img src={userAssetImg} alt=""/>*/}
                            {/*<span className="recommend-label">{intl.get('download_7')}:</span>*/}
                            {/*<span className="recommend-value">{this.state.recommendValue} BTC</span>*/}
                        {/*</div>*/}
                    </div>

                    <div className="title">Digital Currency Assets</div>
                    <div className="asset-detail">
                        <div className="clearfix asset-item th-row">
                            <div className="asset-col">Coin</div>
                            <div className="asset-col">Balance</div>
                            <div className="asset-col">Available</div>
                            <div className="asset-col">In Use</div>
                            <div className="asset-col">Operation</div>
                        </div>
                        {this.state.assetList.map(asset => {
                            return (
                                <div className="clearfix asset-item" key={asset.id}>
                                    {/*txt-left*/}
                                    <div className="asset-col txt-left">
                                        <img src={asset.icon} alt=""/>
                                        {asset.coin_code}<span className="full-name">({asset.coin_name})</span>
                                    </div>
                                    <div className="asset-col">{asset.total_balance}</div>
                                    <div className="asset-col">{asset.available_balance}</div>
                                    <div className="asset-col">{asset.frozen_balance}</div>
                                    <div className="asset-col">
                                        <button className="btn btn-desposit" onClick={this.goDesposit.bind(this, asset)}>Desposit</button>
                                        <button className="btn btn-withdrawal" onClick={this.goWithdrawal.bind(this, asset)}>Withdrawal</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="title">Fiat Currency Assets </div>
                    <div className="asset-detail">
                        <div className="clearfix asset-item th-row">
                            <div className="asset-col">Coin</div>
                            <div className="asset-col">Balance</div>
                            <div className="asset-col">Available</div>
                            <div className="asset-col">In Use</div>
                            <div className="asset-col">Operation</div>
                        </div>
                        {this.state.legalAssetList.map(asset => {
                            return (
                                <div className="clearfix asset-item" key={asset.id}>
                                    <div className="asset-col">
                                        {/*<img src={asset.icon} alt=""/>*/}
                                        {asset.coin_code}
                                        {/*<span className="full-name">({asset.coin_name})</span>*/}
                                    </div>
                                    <div className="asset-col">{asset.total_balance}</div>
                                    <div className="asset-col">{asset.available_balance}</div>
                                    <div className="asset-col">{asset.frozen_balance}</div>
                                    <div className="asset-col">
                                        <button className="btn btn-desposit" onClick={this.goLegalDesposit.bind(this, asset)}>Desposit</button>
                                        <button className="btn btn-withdrawal" onClick={this.goLegalWithdrawal.bind(this, asset)}>Withdrawal</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <Modal
                    className="modal-user-level"
                    visible={this.state.visible}
                    width={557}
                    style={{top: 250}}
                    onCancel={this.levelCancel.bind(this)}
                >
                    <div className="title">{intl.get('levelDescription')}</div>
                    <div className="content">
                        <div className="clearfix level-head">
                            <div className="level-col level-col-1">{intl.get('level')}</div>
                            <div className="level-col level-col-2">{intl.get('withdrawalLimit')}</div>
                            <div className="level-col level-col-3">{intl.get('exchangeAuth')}</div>
                            {/*<div className="level-col level-col-4">{intl.get('otcLimitAuth')}</div>*/}
                            {/*<div className="level-col level-col-5">{intl.get('otcLimit')}</div>*/}
                        </div>
                        <div className="clearfix level-body">
                            <div className="level-col level-col-1"><img src={userLevel1Img} alt=""/></div>
                            <div className="level-col level-col-2">{intl.get('level_lower')}</div>
                            <div className="level-col level-col-3">{intl.get('level_has')}</div>
                            {/*<div className="level-col level-col-4">{intl.get('level_no')}</div>*/}
                            {/*<div className="level-col level-col-5">{intl.get('level_no')}</div>*/}
                        </div>
                        <div className="clearfix level-body">
                            <div className="level-col level-col-1"><img src={userLevel2Img} alt=""/></div>
                            <div className="level-col level-col-2">{intl.get('level_middle')}</div>
                            <div className="level-col level-col-3">{intl.get('level_has')}</div>
                            {/*<div className="level-col level-col-4">{intl.get('level_has')}</div>*/}
                            {/*<div className="level-col level-col-5">{intl.get('level_lower')}</div>*/}
                        </div>
                        <div className="clearfix level-body">
                            <div className="level-col level-col-1"><img src={userLevel3Img} alt=""/></div>
                            <div className="level-col level-col-2">{intl.get('level_higher')}</div>
                            <div className="level-col level-col-3">{intl.get('level_has')}</div>
                            {/*<div className="level-col level-col-4">{intl.get('level_has')}</div>*/}
                            {/*<div className="level-col level-col-5">{intl.get('level_higher')}</div>*/}
                        </div>
                    </div>
                </Modal>

                <Modal
                    className="modal-confirm-davao modal-big"
                    visible={this.state.detailsVisible}
                    width={870}
                    style={{top: 100}}
                    onCancel={this.handleDetailsClose.bind(this)}
                    footer=''
                >
                    {this.state.detailsVisible && (
                        <AssetDetails/>
                    )}
                </Modal>
            </div>
        );
    }
}

export default User;