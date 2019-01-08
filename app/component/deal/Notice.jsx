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
        const data = [{
            title: 'xxx',
            content: '<p>\n' +
            '                                Since Overstock went public in 2002 we have sought to set a gold standard in candidly communicating your firm\'s results to you.\n' +
            '                            </p>\n' +
            '                            <p>\n' +
            '                                As teenagers my brothers and I ran a Christmas tree lot. We cared about reality, not cosmetics, and wanted an accounting system to help us understand and run our business. We devised a system we called, "cigar-box accounting," because at day\'s end, standing by the trashcan fire, we counted bills in a cigar box and knew what we had made or lost. It was simple, foolproof, and we made good decisions using it.\n' +
            '                            </p>',
            date: '2018-12-28'
        }, {
            title: 'yyyy',
            content: '<p>\n' +
            '                                Since Overstock went public in 2002 we have sought to set a gold standard in candidly communicating your firm\'s results to you.\n' +
            '                            </p>\n' +
            '                            <p>\n' +
            '                                As teenagers my brothers and I ran a Christmas tree lot. We cared about reality, not cosmetics, and wanted an accounting system to help us understand and run our business. We devised a system we called, "cigar-box accounting," because at day\'s end, standing by the trashcan fire, we counted bills in a cigar box and knew what we had made or lost. It was simple, foolproof, and we made good decisions using it.\n' +
            '                            </p>\n' +
            '                            <p>\n' +
            '                                In our public SEC filings we use GAAP principles, of course (and when there is a choice to be made, I choose principles at the conservative edge of GAAP), but as the CEO of Overstock I use internal methods of accounting that are quite straightforward and generally follow GAAP, but with a few exceptions that I believe better reveal the economics of our business and lead to more informed management decisions. I want shareholders to understand the economics of their business and the metrics we use to manage it effectively, both GAAP and non-GAAP.\n' +
            '                            </p>\n' +
            '                            <p>\n' +
            '                                Therefore, I describe our GAAP and our internal accounting methods below with particular attention paid to the similarities and differences between the two.\n' +
            '                                GAAP METRICS - see SEC filings for greater detail\n' +
            '                                Revenue is comprised of direct revenue, and partner revenue. All revenue amounts are net of returns, chargebacks and fraud, Club O rewards earned (our loyalty program), and sales discounts, primarily coupons.\n' +
            '                                Direct revenue consists of merchandise sales made to individual consumers and businesses, from inventory we own and fulfill from our warehouses.\n' +
            '                                Partner revenue consists of merchandise sales made to individual consumers and businesses, from inventory owned by other retailers, distributors or manufacturers, fulfilled either by such suppliers directly or in some cases fulfilled by us from warehouses we operate as a service for our partners. We do not own the merchandise for these transactions unless the product is returned.\n' +
            '                                Cost of Goods Sold consists primarily of the costs of merchandise sold to customers, fixed warehouse costs, warehouse handling costs, inbound and outbound shipping costs, credit card fees and customer service costs.\n' +
            '                                Sales and Marketing consists primarily of online and offline advertising, public relations, as well as the costs of our staff engaged in marketing and selling activities.\n' +
            '                                Technology Expense consist of the costs of our technology staff, technology vendor costs such as licenses, support and maintenance, and depreciation and amortization related to software, computer equipment, and web development projects.\n' +
            '                                General and Administrative consist of the costs of our merchandising team, analytics, human resources, accounting, legal, and other support staff, audit and legal fees, insurance, rents and utilities, and other general corporate expenses.\n' +
            '                            </p>',
            date: '2019-1-3'
        }]

        this.setState({
            data: data
        })
    }

    componentDidUpdate(prevProps, prevState) {
    }

    handleClose() {
        this.setState({
            visible: false
        })
    }

    showDetail(i) {
        this.setState({
            visible: true,
            title: this.state.data[i].title,
            content: this.state.data[i].content
        })
    }

    render() {
        const { type } = this.props
        return (
            <div className="journalism-wrap notice-wrap">
                <div className="clearfix">
                    <span className="module-title">Notice</span>
                    <a className="module-more" href="javascript:">more</a>
                </div>
                <div className="module-list">
                    <ul>
                        {this.state.data.map((item, i) => {
                            return (
                                <li onClick={this.showDetail.bind(this, i)} key={i}>
                                    <div className="item-title">{item.title}</div>
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
                        <div className="content" dangerouslySetInnerHTML={{__html: this.state.content}}></div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default User;