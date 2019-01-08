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
            visible: false
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    showMore() {
        this.setState({
            visible: true
        })
    }
    handleClose() {
        this.setState({
            visible: false
        })
    }

    render() {
        const { type } = this.props
        return (
            <div className="company-info-wrap">
                <div className="clearfix">
                    <span className="company-name">OverStork</span>
                    <a className="module-more" href="javascript:" onClick={this.showMore.bind(this)}>more</a>
                </div>
                <div className="company-info">
                    Since Overstock went public in 2002 we have sought to set a gold standard in candidly
                    communicating your firm's results to you.
                    As teenagers my brothers and I ran a Christmas tree lot. We cared about reality, not cosmetics,
                    and wanted an accounting system to help us understand and run our business. We devised a system we called,
                    "cigar-box accounting," because at day's end, standing by the trashcan fire,
                    we counted bills in a cigar box and knew what we had made or lost. It was simple, foolproof,
                    and we made good decisions using it. In our public SEC filings we use GAAP principles, of course
                    (and when there is a choice to be made, I choose principles at the conservative edge of GAAP),
                    but as the CEO of Overstock I... internal methods of accounting that are quite straightforward and generally
                    follow GAAP, but with a few exceptions that I believe better reveal the economics of our business and lead to more
                    informed management decisions. I want shareholders to understand the economics of their business and the metrics we use
                    to manage it effectively, both GAAP and non-GAAP. Therefore, I describe our GAAP and our internal accounting methods below
                    with particular attention paid to the similarities and differences between t
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
                        <div className="title">STORK</div>
                        <div className="content">
                            <p>
                                Since Overstock went public in 2002 we have sought to set a gold standard in candidly communicating your firm's results to you.
                            </p>
                            <p>
                                As teenagers my brothers and I ran a Christmas tree lot. We cared about reality, not cosmetics, and wanted an accounting system to help us understand and run our business. We devised a system we called, "cigar-box accounting," because at day's end, standing by the trashcan fire, we counted bills in a cigar box and knew what we had made or lost. It was simple, foolproof, and we made good decisions using it.
                            </p>
                            <p>
                                In our public SEC filings we use GAAP principles, of course (and when there is a choice to be made, I choose principles at the conservative edge of GAAP), but as the CEO of Overstock I use internal methods of accounting that are quite straightforward and generally follow GAAP, but with a few exceptions that I believe better reveal the economics of our business and lead to more informed management decisions. I want shareholders to understand the economics of their business and the metrics we use to manage it effectively, both GAAP and non-GAAP.
                            </p>
                            <p>
                                Therefore, I describe our GAAP and our internal accounting methods below with particular attention paid to the similarities and differences between the two.
                                GAAP METRICS - see SEC filings for greater detail
                                Revenue is comprised of direct revenue, and partner revenue. All revenue amounts are net of returns, chargebacks and fraud, Club O rewards earned (our loyalty program), and sales discounts, primarily coupons.
                                Direct revenue consists of merchandise sales made to individual consumers and businesses, from inventory we own and fulfill from our warehouses.
                                Partner revenue consists of merchandise sales made to individual consumers and businesses, from inventory owned by other retailers, distributors or manufacturers, fulfilled either by such suppliers directly or in some cases fulfilled by us from warehouses we operate as a service for our partners. We do not own the merchandise for these transactions unless the product is returned.
                                Cost of Goods Sold consists primarily of the costs of merchandise sold to customers, fixed warehouse costs, warehouse handling costs, inbound and outbound shipping costs, credit card fees and customer service costs.
                                Sales and Marketing consists primarily of online and offline advertising, public relations, as well as the costs of our staff engaged in marketing and selling activities.
                                Technology Expense consist of the costs of our technology staff, technology vendor costs such as licenses, support and maintenance, and depreciation and amortization related to software, computer equipment, and web development projects.
                                General and Administrative consist of the costs of our merchandising team, analytics, human resources, accounting, legal, and other support staff, audit and legal fees, insurance, rents and utilities, and other general corporate expenses.
                            </p>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default User;