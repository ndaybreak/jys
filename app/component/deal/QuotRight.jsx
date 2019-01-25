import React from 'react';
import intl from 'react-intl-universal'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, parseTime, toFixed, getPrecision } from '@/utils'
import { getCommissionList, getAssetList } from '@/api'
import { latestDealSub } from '@/api/quot'
import eventProxy from '@/utils/eventProxy'

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: []
        }
    }

    componentDidMount() {
        eventProxy.on('coinsUpdate', (data) => {
            const precision = getPrecision(data.targetPrecision)
            this.setState({
                precisionValue: precision
            })
            const para = {
                mainCoinCode: data.target,
                targetCoinCode: data.base
            }
            latestDealSub(para, data => {
                this.setState({
                    data: data
                })
            })
        })
    }

    selectItem(item) {
        eventProxy.trigger('priceSelect', item.price)
    }

    render() {
        return (
            <div className="quot-right">
                <div className="quot-title clearfix">
                    <div className="quot-col quot-col-1 quot-right-col-1">{intl.get('price')}</div>
                    <div className="quot-col quot-col-2 quot-right-col-2">{intl.get('volume')}</div>
                    <div className="quot-col quot-col quot-right-col-3">Time</div>
                </div>
                <div className="quot-body">
                    <div className="quot-deal">
                        {this.state.data.map((item, index) => {
                            return (
                                <div className="quot-item clearfix" key={index} onClick={this.selectItem.bind(this, item)}>
                                    <div className={'quot-col quot-col-1 quot-right-col-1 ' + (item.direction === 'Sell' ? 'direction-sell' : 'direction-buy')}>{toFixed(item.price, this.state.precisionValue)}</div>
                                    <div className="quot-col quot-col-2 quot-right-col-2">{item.quantity}</div>
                                    <div className="quot-col quot-right-col-3">{parseTime(item.date, '{h}:{i}:{s}')}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default User;