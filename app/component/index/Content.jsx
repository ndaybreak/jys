import React from 'react';
import intl from 'react-intl-universal'
import { jumpUrl, isLangZH, ui } from '@/utils'
import { getMarketCoinQuot, getTargetPairsQuot } from '@/api/quot'
import { getRecommendCoins, getCoin2CoinList } from '@/api'

const isZh = isLangZH()

const formatCoin2CoinData = (data) => {
    const result = {}
    data.forEach(item => {
        result[item.code.split('/')[1]] = 1
    })
    return Object.keys(result)
}

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUp: false,
            activeCategory: '',
            categoryList: [],
            data: [],
            recommendData: []
        }
    }

    componentWillMount() {

    }
    componentDidMount() {
        getCoin2CoinList().then(res => {
            const list = formatCoin2CoinData(res.data)
            this.setState({
                categoryList: list,
                activeCategory: list[0]
            })
            getMarketCoinQuot({ code: list[0] }, data => {
                this.setState({
                    data: data
                })
            })
        })
        // getRecommendCoins().then( res => {
        //     let data = res.data
        //     let para = {}
        //     para.targetPairs = data.map(item => {
        //         return {
        //             targetCoinCode: item.BaseCoin,
        //             mainCoinCode: item.QuoteCoin
        //         }
        //     })
        //     getTargetPairsQuot(para, data => {
        //         this.setState({
        //             recommendData: data
        //         })
        //     })
        // })
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
            <div className="market-wrap">
                {/*<div className="common-list clearfix">*/}
                    {/*{*/}
                        {/*this.state.recommendData.map( (row, index) => {*/}
                            {/*return (*/}
                                {/*<a className={'recommend ' + (index % 6 === 5 ? 'recommend-last' : '')} href="javascript:"*/}
                                   {/*key={row.targetPair.mainCoinCode + '_recommend' + index} onClick={this.handleClick.bind(this, row.targetPair)}>*/}
                                    {/*<div className="common-item">*/}
                                        {/*<div>{row.targetPair.targetCoinCode}/{row.targetPair.mainCoinCode}*/}
                                            {/*<span className={`percent ${row.risePercent24h > 0 ? 'p-up' : (row.risePercent24h < 0 ? 'p-down' : '')}`}>{(row.risePercent24h*100).toFixed(2)}%</span>*/}
                                        {/*</div>*/}
                                        {/*<div className="strong-txt">{row.price}</div>*/}
                                    {/*</div>*/}
                                {/*</a>*/}
                            {/*)*/}
                        {/*})*/}
                    {/*}*/}
                {/*</div>*/}
                <div className="market-wrap-inner">
                    <div className="market-category clearfix">
                        {this.state.categoryList.map((category, i) => {
                            return (
                                <span key={i} className={'category ' + (this.state.activeCategory === category ? 'active' : '')} onClick={this.changeCategory.bind(this, category)}>{category}</span>
                            )
                        })}
                    </div>
                    <div className="market-detail market-title">
                        <div className="row">
                            <div className="th col-1">{intl.get('market')}</div>
                            <div className="th col-2">{intl.get('latestPrice')}</div>
                            <div className="th col-3" style={{paddingRight: '0px'}}>{intl.get('volume')}</div>
                            <div className="th col-4" style={{paddingRight: '0px'}}>{intl.get('dayChg')}</div>
                            <div className="th col-5" style={{paddingRight: '0px'}}>{intl.get('dayHighestPrice')}</div>
                            <div className="th col-6" style={{paddingRight: '0px'}}>{intl.get('dayLowestPrice')}</div>
                        </div>
                    </div>
                    <div className="market-detail market-content">
                        {
                            this.state.data.map( (row, index) => {
                                return (
                                    <div className={'row ' + (index%2 === 0 ? 'row-odd' : '')} key={row.targetPair.mainCoinCode + '_' + index} onClick={this.handleClick.bind(this, row.targetPair)}>
                                        <div className="td col-1">{row.targetPair.targetCoinCode}/{row.targetPair.mainCoinCode}</div>
                                        {/*<div className="td col-2">{row.price} / {isZh ? ('￥' + row.rmbPrice) : ('$' + row.legalTenderPrice)}</div>*/}
                                        <div className="td col-2">{row.price}</div>
                                        <div className="td col-3">{row.volumes}</div>
                                        <div className={`td col-4 ${row.risePercent24h > 0 ? 'p-up' : (row.risePercent24h < 0 ? 'p-down' : '')}`}>
                                            {(row.risePercent24h*100).toFixed(2)}%
                                        </div>
                                        <div className="td col-5">{row.highestPrice}</div>
                                        <div className="td col-6">{row.lowestPrice}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;