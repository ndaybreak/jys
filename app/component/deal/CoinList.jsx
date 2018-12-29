import React from 'react';
import intl from 'react-intl-universal'
import { getMarketCoinQuot, getTargetPairsQuot } from '@/api/quot'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH } from '@/utils'

class CoinList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCategory: 'BTC',
            data: []
        }

        getMarketCoinQuot({ code: this.state.activeCategory }, data => {
            this.setState({
                data: data
            })
        })
    }

    componentDidMount() {

    }

    changeCategory(val) {
        this.setState({
            activeCategory: val
        })
        if(val === 'MY') {
        } else {
            getMarketCoinQuot({ code: val }, data => {
                this.setState({
                    data: data
                })
            })
        }
    }

    handleClick(pair) {
        jumpUrl('deal.html', {
            base: pair.targetCoinCode,
            target: pair.mainCoinCode
        })
    }

    render() {
        return (
            <div className="coin-list-inner">
                <div className="market-category clearfix">
                    <span className={`category ${this.state.activeCategory === 'USDT' ? 'active' : ''}`} onMouseEnter={this.changeCategory.bind(this, 'USDT')}>USDT</span>
                    <span className={`category ${this.state.activeCategory === 'BTC' ? 'active' : ''}`} onMouseEnter={this.changeCategory.bind(this, 'BTC')}>BTC</span>
                    <span className={`category ${this.state.activeCategory === 'ETH' ? 'active' : ''}`} onMouseEnter={this.changeCategory.bind(this, 'ETH')}>ETH</span>
                </div>
                <div className="market-detail">
                    <div className="row" style={{'backgroundColor': '#f9f9fb'}}>
                        <div className="th col-1">{intl.get('market')}</div>
                        <div className="th col-2 txt-right">{intl.get('price')}</div>
                        <div className="th col-3 txt-right">{intl.get('dayChg')}</div>
                    </div>
                    {
                        this.state.data.map( (row, index) => {
                            return (
                                <div className="row" key={row.targetPair.mainCoinCode + '_' + index}>
                                    <div className="td col-1" onClick={this.handleClick.bind(this, row.targetPair)}>{row.targetPair.targetCoinCode}/{row.targetPair.mainCoinCode}</div>
                                    <div className="td col-2 txt-right" onClick={this.handleClick.bind(this, row.targetPair)}>{row.price}</div>
                                    <div className={`td col-3 txt-right ${row.risePercent24h > 0 ? 'p-up' : (row.risePercent24h < 0 ? 'p-down' : '')}`} onClick={this.handleClick.bind(this, row.targetPair)}>
                                        {(row.risePercent24h*100).toFixed(2)}%
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}


export default CoinList;
