import React from 'react';
import intl from 'react-intl-universal'
import QuotSelect from './QuotSelect';
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH } from '@/utils'
import { getCommissionList, getAssetList, getAccountInfo } from '@/api'
import { entrustOrderSub } from '@/api/quot'
import eventProxy from '@/utils/eventProxy'

const COIN = {
    base: '',
    target: ''
}

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            buyOrders: [],
            saleOrders: [],
            price: '',
            otcPrice: '',
            typeValue: 0,
            typeList: [{
                value: 0,
                label: intl.get('all')
            }, {
                value: 1,
                label: intl.get('sellOnly')
            }, {
                value: 2,
                label: intl.get('buyOnly')
            }]
        }
    }

    getPrecision(val) {
        return (val + '').split('.')[1].length
    }
    getPrecisionList(precision) {
        var list = []
        while(list.length < 3 && precision > 0) {
            list.push({
                label: precision + (precision === 1 ? intl.get('decimal') : intl.get('decimals')),
                value: precision
            })
            precision--
        }
        return list
    }

    componentDidMount() {
        eventProxy.on('coinsUpdate', (data) => {
            const precision = this.getPrecision(data.targetPrecision)
            this.setState({
                precisionValue: precision,
                precistionList: this.getPrecisionList(precision)
            })
            COIN.base = data.base
            COIN.target = data.target
            this.queryEntrustOrder(precision)
        })
    }

    queryEntrustOrder(precision) {
        const para = {
            targetPair: {
                mainCoinCode: COIN.target,
                targetCoinCode: COIN.base
            },
            scale: precision + ''
        }
        entrustOrderSub(para, data => {
            this.setState({
                buyOrders: data.buyOrders,
                saleOrders: data.saleOrders,
                price: data.price,
                otcPrice: isLangZH() ? ('￥ ' + data.rmbPrice) : ('$ ' + data.usdPrice)
            })
        })
    }

    precisionChange(val) {
        this.queryEntrustOrder(val, val)
    }
    typeChange(val) {
        this.setState({
            typeValue: val
        })
    }

    selectItem(item) {
        eventProxy.trigger('priceSelect', item.price)
    }

    render() {
        const saleOrders = this.state.typeValue === 1 ? this.state.saleOrders.slice(0, 16).reverse() : this.state.saleOrders.slice(0, 8).reverse()
        const buyOrders = this.state.typeValue === 2 ? this.state.buyOrders.slice(-16) : this.state.buyOrders.slice(-8)
        return (
            <div className="quot-left">
                <div className="quot-title clearfix">
                    <div className="quot-col quot-col-1">{intl.get('price')}</div>
                    <div className="quot-col quot-col-2">{intl.get('amount')}</div>
                </div>
                <div className="quot-body">
                    {this.state.typeValue !== 2 && (
                        <div className="quot-sell">
                            {saleOrders.map((item, index) => {
                                return (
                                    <div className="quot-item clearfix" key={index} onClick={this.selectItem.bind(this, item)}>
                                        <div className="quot-col quot-col-1">{item.price}</div>
                                        <div className="quot-col quot-col-2">{item.quantity}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <div className="quot-current">
                        {this.state.price} {this.state.otcPrice}
                    </div>
                    {this.state.typeValue !== 1 && (
                        <div className="quot-buy">
                            {buyOrders.map((item, index) => {
                                return (
                                    <div className="quot-item clearfix" key={index} onClick={this.selectItem.bind(this, item)}>
                                        <div className="quot-col quot-col-1">{item.price}</div>
                                        <div className="quot-col quot-col-2">{item.quantity}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
                <div className="quot-footer clearfix">
                    <div className="footer-left">
                        {/*<QuotSelect value={this.state.precisionValue} data={this.state.precistionList} onChange={this.precisionChange.bind(this)}/>*/}
                    </div>
                    <div className="footer-right">
                        <QuotSelect value={this.state.typeValue} data={this.state.typeList} onChange={this.typeChange.bind(this)}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default User;