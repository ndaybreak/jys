import React from 'react';
import intl from 'react-intl-universal'
import { getMarketCoinQuot, getTargetPairsQuot } from '@/api/quot'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, deepClone } from '@/utils'

let timeType = '1m'

class CoinList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }

    componentDidMount() {

    }

    changeType(type) {
        timeType = type
        this.props.changeTimeType(type)
    }

    render() {
        return (
            <div className="coin-list-inner">
                <span className={'time-type ' + (timeType === '1m' ? 'active' : '')} onClick={this.changeType.bind(this, '1m')}>1min</span>
                <span className={'time-type ' + (timeType === '5m' ? 'active' : '')} onClick={this.changeType.bind(this, '5m')}>5min</span>
                <span className={'time-type ' + (timeType === '15m' ? 'active' : '')} onClick={this.changeType.bind(this, '15m')}>15min</span>
                <span className={'time-type ' + (timeType === '30m' ? 'active' : '')} onClick={this.changeType.bind(this, '30m')}>30min</span>
                <span className={'time-type ' + (timeType === '1h' ? 'active' : '')} onClick={this.changeType.bind(this, '1h')}>1hour</span>
                <span className={'time-type ' + (timeType === '4h' ? 'active' : '')} onClick={this.changeType.bind(this, '4h')}>4hour</span>
                <span className={'time-type ' + (timeType === '1d' ? 'active' : '')} onClick={this.changeType.bind(this, '1d')}>1day</span>
                <span className={'time-type ' + (timeType === '1w' ? 'active' : '')} onClick={this.changeType.bind(this, '1w')}>1week</span>
            </div>
        );
    }
}


export default CoinList;
