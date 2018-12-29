import React from 'react';
import '@/public/css/rule.pcss'
import '@/public/css/rule-rate.pcss';
import { getRates } from '@/api'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        getRates().then(res => {
            this.setState({
                data: res.data
            })
        })
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div className="rule-page">
                <div className="title">规则</div>
                <ul className="rule-toolbar">
                    <li className="tool-item"><a href="rule-service.html">服务条款</a></li>
                    <li className="tool-item tool-rate active"><a href="rule-rate.html">费率说明</a></li>
                    <li className="tool-item"><a href="rule-manage.html">管理规则</a></li>
                </ul>
                <div className="rule-content content-rate">
                    <div className="rate-item">交易费率：<span style={{color: '#666'}}>普通用户：0.1% 交易手续费。（扣除收取到的资产）</span></div>
                    <div className="rate-item">充值费率：<span style={{color: '#666'}}>免费</span></div>
                    <div className="rate-item">提现费率：<span style={{color: '#ff0000'}}>提现手续费将会根据区块实际情况定期调整</span></div>
                    <div className="rate-table">
                        <div className="rate-row clearfix">
                            <div className="col-1 th">币种</div>
                            <div className="col-2 th">最小提币数量</div>
                            <div className="col-3 th">提币手续费</div>
                        </div>
                        {
                            this.state.data.map((item, index) => {
                                return (
                                    <div className="rate-row clearfix" key={'rate_row_' + index}>
                                        <div className="col-1 td">
                                            <img src={item.icon} alt=""/><span className="coin-code">{item.coin_code}</span>{item.coin_name}
                                        </div>
                                        <div className="col-2 td">{item.min_quantity}</div>
                                        <div className="col-3 td">{item.fee_rate} {item.coin_code}</div>
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

export default Index;