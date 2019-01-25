import React from 'react';
import intl from 'react-intl-universal'
import { Modal, Button } from 'antd';
import ReactCodeInput from 'react-code-input'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, isLogin } from '@/utils'
import { setSessionData, getSessionData, removeSessionData } from '@/data'
import { getEntrustmentList, entrustmentTrade } from '@/api'
import BoxNumber from '@/component/common/ui/BoxNumber'
// import { getTargetPairsQuot } from '@/api/quot'
import eventProxy from '@/utils/eventProxy'

const DATA = {
    'BTC': [{
        title: 'Deploying Censorship-Resistance to Uphold Decentralization',
        url: 'resource/btc_announce_1.html',
        date: '2019-01-11'
    }, {
        title: 'Pump and Dumps Are the Final Indignity for Dying Coins',
        url: 'resource/btc_announce_2.html',
        date: '2019-01-18'
    }],
    'ETH': [{
        title: '3 Factors Currently Affecting the Price of Ethereum (ETH)',
        url: 'resource/eth_announce_1.html',
        date: '2019-01-05'
    }, {
        title: 'Ethereum (ETH) Network Hits Key Milestone Amid Crypto Bear Market',
        url: 'resource/eth_announce_2.html',
        date: '2019-01-18'
    }]
}

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            data: [],
            title: '',
            content: ''
        }
    }

    componentDidMount() {
        eventProxy.on('coinsUpdate', (data) => {
            const list = DATA[data.base]
            if(list) {
                this.setState({
                    data: list
                })
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
    }

    handleClose() {
        this.setState({
            visible: false,
            url: ''
        })
    }

    showDetail(i) {
        this.setState({
            visible: true,
            title: this.state.data[i].title,
            url: this.state.data[i].url
        })
    }

    render() {
        const { type } = this.props
        return (
            <div className="journalism-wrap notice-wrap">
                <div className="clearfix">
                    <span className="module-title">Announcement</span>
                    <a className="module-more" href="javascript:">more</a>
                </div>
                <div className="module-list">
                    <ul>
                        {this.state.data.map((item, i) => {
                            return (
                                <li onClick={this.showDetail.bind(this, i)} key={i}>
                                    <div className="item-title"><a href="javascript:">{item.title}</a></div>
                                    <div className="item-date">{item.date}</div>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <Modal
                    className="modal-confirm-davao modal-big"
                    visible={this.state.visible}
                    width={870}
                    style={{top: 100}}
                    onCancel={this.handleClose.bind(this)}
                    footer=''
                >
                    <div className="davao-confirm-wrap">
                        <div className="title">{this.state.title}</div>
                        <div className="content">
                            <iframe src={this.state.url} frameBorder="0" style={{width: '100%', minHeight: '500px'}}></iframe>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default User;