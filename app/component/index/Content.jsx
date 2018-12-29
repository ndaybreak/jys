import React from 'react';
import intl from 'react-intl-universal'
import { jumpUrl, isLangZH } from '@/utils'
import { getMarketCoinQuot, getTargetPairsQuot } from '@/api/quot'
import { getRecommendCoins } from '@/api'

const isZh = isLangZH()

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUp: false,
            activeCategory: 'BTC',
            data: [],
            recommendData: []
        }
    }

    componentWillMount() {

    }
    componentDidMount() {
        getMarketCoinQuot({ code: this.state.activeCategory }, data => {
            this.setState({
                data: data
            })
        })
        getRecommendCoins().then( res => {
            let data = res.data
            let para = {}
            para.targetPairs = data.map(item => {
                return {
                    targetCoinCode: item.BaseCoin,
                    mainCoinCode: item.QuoteCoin
                }
            })
            getTargetPairsQuot(para, data => {
                this.setState({
                    recommendData: data
                })
            })
        })
    }

    componentWillUnmount() {
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
            <div className="home-content">
                <div className="common-list clearfix">
                    {
                        this.state.recommendData.map( (row, index) => {
                            return (
                                <a className={'recommend ' + (index % 6 === 5 ? 'recommend-last' : '')} href="javascript:"
                                   key={row.targetPair.mainCoinCode + '_recommend' + index} onClick={this.handleClick.bind(this, row.targetPair)}>
                                    <div className="common-item">
                                        <div>{row.targetPair.targetCoinCode}/{row.targetPair.mainCoinCode}
                                            <span className={`percent ${row.risePercent24h > 0 ? 'p-up' : (row.risePercent24h < 0 ? 'p-down' : '')}`}>{(row.risePercent24h*100).toFixed(2)}%</span>
                                        </div>
                                        <div className="strong-txt">{row.price}</div>
                                    </div>
                                </a>
                            )
                        })
                    }
                </div>
                <div className="market-category clearfix">
                    {/*<span className={`category ${this.state.activeCategory === 'MY' ? 'active' : ''}`} onClick={this.changeCategory.bind(this, 'MY')}>自选</span>*/}
                    <span className={`category ${this.state.activeCategory === 'USDT' ? 'active' : ''}`} onMouseEnter={this.changeCategory.bind(this, 'USDT')}>USDT</span>
                    <span className={`category ${this.state.activeCategory === 'BTC' ? 'active' : ''}`} onMouseEnter={this.changeCategory.bind(this, 'BTC')}>BTC</span>
                    <span className={`category ${this.state.activeCategory === 'ETH' ? 'active' : ''}`} onMouseEnter={this.changeCategory.bind(this, 'ETH')}>ETH</span>
                </div>
                <div className="market-detail">
                    <div className="row">
                        <div className="th col-1">{intl.get('market')}</div>
                        <div className="th col-2 txt-right" style={{paddingRight: '90px'}}>{intl.get('latestPrice')}</div>
                        <div className="th col-3 txt-right" style={{paddingRight: '50px'}}>{intl.get('volume')}</div>
                        <div className="th col-4 txt-right" style={{paddingRight: '6px'}}>{intl.get('dayChg')}</div>
                        <div className="th col-5 txt-right" style={{paddingRight: '20px'}}>{intl.get('dayHighestPrice')}</div>
                        <div className="th col-6 txt-right" style={{paddingRight: '20px'}}>{intl.get('dayLowestPrice')}</div>
                    </div>
                    {
                        this.state.data.map( (row, index) => {
                            return (
                                <div className="row" key={row.targetPair.mainCoinCode + '_' + index} onClick={this.handleClick.bind(this, row.targetPair)}>
                                    <div className="td col-1">{row.targetPair.targetCoinCode}/{row.targetPair.mainCoinCode}</div>
                                    <div className="td col-2 txt-right">{row.price} / {isZh ? ('￥' + row.rmbPrice) : ('$' + row.legalTenderPrice)}</div>
                                    <div className="td col-3 txt-right">{row.volumes}</div>
                                    <div className="td col-4 txt-right"
                                         className={`td col-4 txt-right ${row.risePercent24h > 0 ? 'p-up' : (row.risePercent24h < 0 ? 'p-down' : '')}`}>
                                        {(row.risePercent24h*100).toFixed(2)}%
                                    </div>
                                    <div className="td col-5 txt-right">{row.highestPrice}</div>
                                    <div className="td col-6 txt-right">{row.lowestPrice}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Content;