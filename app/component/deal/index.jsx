import React from 'react';
import Chart from './Chart';
import EntrustOrder from './EntrustOrder';
import QuotLeft from './QuotLeft';
import QuotRight from './QuotRight';
import Order from './Order';
import Journalism from './Journalism';
import CompanyInfo from './CompanyInfo';
import Notice from './Notice';

import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH } from '@/utils'
import '@/public/css/deal.pcss';
import { getTradeLimitParameter } from '@/api'
import { getPriceBtcQuot, getTargetPairsQuot } from '@/api/quot'
import eventProxy from '@/utils/eventProxy'

class Deal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            base: getSearchPara('base') || 'BTC',
            target: getSearchPara('target') || 'HKD',
            // base: getSearchPara('base') || 'STOX01.ST',
            // target: getSearchPara('target') || 'HKD',
            width: document.body.clientWidth - 620
        }
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({
                width: document.body.clientWidth - 620
            })
        })

        getTradeLimitParameter(this.state.base, this.state.target).then(res => {
            const para = {
                base: this.state.base,
                target: this.state.target,
                targetMin: res.data.marketMinQuantity,
                baseMin: res.data.targetMinQuantity,
                basePrecision: res.data.targetPrecision,
                targetPrecision: res.data.marketPrecision
            }
            eventProxy.trigger('coinsUpdate', para)
        })
    }

    render() {
        return (
            <div className="deal-page clearfix">
                <div className="page-right">
                    <div className="quot-wrap clearfix">
                        <QuotLeft />
                        <QuotRight />
                    </div>
                    <Order />
                    <Notice />
                </div>

                <div className="page-left">
                    <Chart width={this.state.width} type="svg"/>
                    <EntrustOrder />
                    <div className="clearfix">
                        <Journalism/>
                        <CompanyInfo/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Deal;