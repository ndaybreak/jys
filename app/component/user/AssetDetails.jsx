import React from 'react';
import intl from 'react-intl-universal'
import { getMarketCoinQuot, getTargetPairsQuot } from '@/api/quot'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, parseTime } from '@/utils'
import { getCommissionList, getAssetList, getCoinAssetLog, getCoinList } from '@/api'
import BoxSelect from '@/component/common/ui/BoxSelect'
import { Pagination, Spin } from 'antd';

class AssetDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currPage: 1,
            loading: false,
            data: [],
            total: 0,
            coinList: [],
            typeList: [{
                id: 0,
                value: 'All types'
            }, {
                id: 1,
                value: 'Recharge'
            }, {
                id: 2,
                value: 'Withdraw'
            }, {
                id: 3,
                value: 'VC-Exchange'
            }, {
                id: 4,
                value: 'AD'
            }
            // , {
            //     id: 5,
            //     value: 'OTC trade'
            // }
            , {
                id: 7,
                value: 'System'
            }],
            dateList: [{
                id: 0,
                value: 'All times'
            }, {
                id: 1,
                value: '1D'
            }, {
                id: 2,
                value: '3D'
            }, {
                id: 3,
                value: '1W'
            }, {
                id: 4,
                value: '1M'
            }]
        }
    }

    componentDidMount() {
        getCoinList().then(res => {
            this.setState({
                coinList: [{id: 0, coin_code: 'All'}].concat(res.data)
            })
        })
        this.loadData(1)
    }

    assetFilter() {
        setTimeout(() => {
            this.loadData(1)
        })
    }

    loadData(page) {
        this.setState({
            currPage: page,
            loading: true
        })
        const para = {
            currPage: page,
            pageSize: 15,
            coinId: this.refs.coinCode.getValue() || '',
            operationType: this.refs.type.getValue() || ''
        }
        const dateType = this.refs.date.getValue()
        if(dateType) {
            let date = new Date()
            if(dateType === 1) {
                date.setDate(date.getDate() - 1)
            } else if(dateType === 2) {
                date.setDate(date.getDate() - 3)
            } else if(dateType === 3) {
                date.setDate(date.getDate() - 7)
            } else if(dateType === 4) {
                date.setDate(date.getDate() - 30)
            }
            para.startTime = date.getTime()
        }
        getCoinAssetLog(para).then(res => {
            this.setState({
                data: res.data,
                loading: false,
                total: res.pageInfo.totalCount
            })
        })
    }

    render() {
        return (
            <div className="davao-confirm-wrap details-wrap">
                <div className="title">Variation details </div>
                <Spin spinning={this.state.loading}>
                    <div className="content">
                        <div className="clearfix">
                            <BoxSelect ref="coinCode"
                                       onChange={this.assetFilter.bind(this)}
                                       defaultValue={0}
                                       placeholder="Please select currency"
                                       options={this.state.coinList} optValue="id" optLabel="coin_code"/>
                            <BoxSelect ref="type"
                                       onChange={this.assetFilter.bind(this)}
                                       defaultValue={0}
                                       placeholder="Please select type"
                                       options={this.state.typeList} optValue="id" optLabel="value"/>
                            <BoxSelect ref="date"
                                       onChange={this.assetFilter.bind(this)}
                                       defaultValue={0}
                                       placeholder="Please select time"
                                       options={this.state.dateList} optValue="id" optLabel="value"/>
                        </div>
                        <div className="table-detail">
                            <div className="clearfix th-row">
                                <div className="col-detail">Currency</div>
                                <div className="col-detail">Balance</div>
                                <div className="col-detail">Type</div>
                                <div className="col-detail">Change</div>
                                <div className="col-detail">Times</div>
                            </div>
                            {this.state.data.map((item, i) => {
                                return (
                                    <div className="clearfix td-row" key={i}>
                                        <div className="col-detail">{item.coin_code}</div>
                                        <div className="col-detail">{item.total_balance}</div>
                                        <div className={'col-detail ' + (item.total_balance_change > 0 ? 'up' : 'down')}>{item.operation_type}</div>
                                        <div className={'col-detail ' + (item.total_balance_change > 0 ? 'up' : 'down')}>{item.total_balance_change}</div>
                                        <div className="col-detail">{parseTime(item.time)}</div>
                                    </div>
                                )
                            })}
                            {this.state.data.length === 0 && (
                                <div className="txt-center" style={{color: '#666666', marginTop: '100px'}}>no data</div>
                            )}
                        </div>
                        <Pagination className="detail-pagination"
                                    total={this.state.total}
                                    current={this.state.currPage}
                                    pageSize={15}
                                    onChange={this.loadData.bind(this)} />
                    </div>
                </Spin>
            </div>
        );
    }
}


export default AssetDetails;
