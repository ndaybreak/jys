import React from 'react';
import intl from 'react-intl-universal'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, isLogin } from '@/utils'
import { getEntrustmentList, getAssetList, getAccountInfo } from '@/api'
import BoxNumber from '@/component/common/ui/BoxNumber'
import eventProxy from '@/utils/eventProxy'
import OrderBuy from './OrderBuy';
import OrderSell from './OrderSell';
import { getTargetPairsQuot } from '@/api/quot'

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'one' // one two
        }
    }

    componentDidMount() {
        isLogin() && getAccountInfo({isMoneyPassword: true}).then(res => {
            this.setState({
                hasMoneyPwd: !!res.data.is_money_password
            })
        })
        isLogin() && getAssetList().then(res => {
            this.setState({
                assetList: res.data
            }, () => {
                this.setAvailable()
            })
        })

        eventProxy.on('coinsUpdate', (data) => {
            this.setState({
                base: data.base,
                target: data.target,
                basePrecision: data.basePrecision,
                targetPrecision: data.targetPrecision,
                targetMin: data.targetMin,
                baseMin: data.baseMin
            }, () => {
                this.setAvailable()
                this.setOtcPrice()
            })
        })
    }

    setOtcPrice() {
        const attr = isLangZH() ? 'rmbPrice' : 'legalTenderPrice'
        let para = {
            // isOnce: true
        }
        para.targetPairs = [{
            targetCoinCode: this.state.base,
            mainCoinCode: this.state.target
        }]
        getTargetPairsQuot(para, data => {
            const item = data[0]
            const value = item.price ? (data[0][attr]/data[0].price) : 0
            this.setState({
                otcPrice: value
            })
        })
    }

    setAvailable() {
        if(this.state.assetList && this.state.base) {
            let list = this.state.assetList
            list.forEach((item) => {
                if(item.coin_code == this.state.base) {
                    this.setState({
                        baseAvailable: item.available_balance
                    })
                }
                if(item.coin_code == this.state.target) {
                    this.setState({
                        targetAvailable: item.available_balance
                    })
                }
            })
        }
    }

    changeType(type) {
        this.setState({
            type: type
        })
    }

    render() {
        return (
            <div className="order-wrap">
                <div className="order-type">
                    <button className={'btn btn-entrust ' + (this.state.type === 'one' ? 'active' : '')} onClick={this.changeType.bind(this, 'one')}>{intl.get('limitOrder')}</button>
                    <button className={'btn btn-entrust ' + (this.state.type === 'two' ? 'active' : '')} onClick={this.changeType.bind(this, 'two')}>{intl.get('marketOrder')}</button>
                </div>
                <div className="order-info clearfix">
                    <OrderBuy base={this.state.base} basePrecision={this.state.basePrecision}
                              target={this.state.target} targetPrecision={this.state.targetPrecision}
                              available={this.state.targetAvailable} hasMoneyPwd={this.state.hasMoneyPwd}
                              minSum={this.state.targetMin} type={this.state.type}
                              otcPrice={this.state.otcPrice}/>
                    <OrderSell base={this.state.base} basePrecision={this.state.basePrecision}
                              target={this.state.target} targetPrecision={this.state.targetPrecision}
                               available={this.state.baseAvailable} hasMoneyPwd={this.state.hasMoneyPwd}
                               minSum={this.state.baseMin} type={this.state.type}
                               otcPrice={this.state.otcPrice}/>

                </div>
            </div>
        )
    }
}

export default User;