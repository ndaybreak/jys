import React from 'react';
import intl from 'react-intl-universal'
// import BoxDate from '@/component/common/ui/BoxDate'
import {getSearchPara, isLangZH, isLogin, jumpUrl, kebabCaseData2Camel, parseTime, ui, validate} from '@/utils'
import directionBuyImg from '@/public/img/买入.png'
import directionSellerImg from '@/public/img/卖出.png'
import {cancelCoinsOrder, getEntrustmentList} from '@/api'
import {Button, DatePicker, Modal} from 'antd';
import eventProxy from '@/utils/eventProxy'

class User extends React.Component {

    constructor(props) {
        super(props);
        const defaultEndTime = this.formatDate(new Date(), true);
        this.state = {
            loading: false,
            type: '24h', // 24h history
            isHistory: true,
            data: [],
            startTime: '',
            endTime: defaultEndTime
        }
    }

    componentDidMount() {
        this.queryOrders()
        eventProxy.on('orderDone', this.queryOrders.bind(this))
    }

    changeType(type) {
        this.setState({
            type: type
        })
        this.queryOrders(type === '24h')
    }

    formatDate(value, isEnd) {
        if (value) {
            let date = new Date(value)
            if (isEnd) {
                date.setHours(0)
                date.setDate(date.getDate() + 1)
                return date.getTime()
            } else {
                return date.getTime()
            }
        } else {
            return ''
        }
    }

    dateChange(isStartTime, value) {
        const time = this.formatDate(value, !isStartTime);
        if (isNaN(time)) return;
        if (isStartTime) {
            this.setState({
                startTime: time
            });
        } else {
            this.setState({
                endTime: time
            });
        }
    }

    queryOrders(isToDay) {
        if (!isLogin()) {
            return
        }
        if (typeof isToDay === 'undefined') {
            isToDay = this.state.type === '24h'
        }
        const para = {
            startTime: isToDay ? '' : this.state.startTime,
            endTime: isToDay ? '' : this.state.endTime,
            isToDay: isToDay
        }
        getEntrustmentList(para).then(res => {
            this.setState({
                data: res.data
            })
        })
    }

    handleSearch() {
        this.queryOrders()
    }

    cancelOrder(id) {
        this.setState({
            cancelId: id,
            visible: true
        })
    }

    cancel() {
        this.setState({
            visible: false
        })
    }

    confirm() {
        cancelCoinsOrder(this.state.cancelId).then(res => {
            this.cancel()
            ui.tip({
                msg: intl.get('successTip'),
                callback: () => {
                    this.queryOrders()
                }
            })
        })
    }

    checkValidDate(isStartTime, moment) {
        return isStartTime ? moment.isSameOrAfter(this.state.endTime, "day") :
            moment.isSameOrBefore(this.state.startTime,"day");
    }

    render() {
        const getOrderStatus = (status) => {
            const list = ['', intl.get('orderCanceled'), intl.get('orderPartDeal'), intl.get('orderTraded')]
            return list[status]
        }
        return (
            <div className="entrust-wrap">
                <div className="entrust-type">
                    <button className={'btn btn-entrust ' + (this.state.type === '24h' ? 'active' : '')}
                            onClick={this.changeType.bind(this, '24h')}>{intl.get('dayEntrust')}</button>
                    <button className={'btn btn-entrust ' + (this.state.type === 'history' ? 'active' : '')}
                            onClick={this.changeType.bind(this, 'history')}>{intl.get('historyEntrust')}</button>
                </div>
                {this.state.type === 'history' && (
                    <div className="time-wrap clearfix">
                        <span className="label">{intl.get('startEndDate')}</span>
                        <DatePicker ref="startTime" className="date-box-entrust"
                                    onChange={this.dateChange.bind(this, true)}
                                    disabledDate={this.checkValidDate.bind(this, true)}
                                    placeholder={intl.get('placeholderStartDate')}/>
                        <span className="label">~</span>
                        <DatePicker ref="endTime" className="date-box-entrust"
                                    onChange={this.dateChange.bind(this, false)}
                                    disabledDate={this.checkValidDate.bind(this, false)}
                                    placeholder={intl.get('placeholderEndDate')}/>
                        <button className="btn btn-primary btn-search"
                                onClick={this.handleSearch.bind(this)}>{intl.get('search')}</button>
                    </div>
                )}
                <div className={'order-table ' + (this.state.type === '24h' ? 'table-24h' : 'table-history')}>
                    <div className="order-title clearfix">
                        <div className="order-col order-col-1">{intl.get('market')}</div>
                        <div className="order-col order-col-2">{intl.get('time')}</div>
                        <div className="order-col order-col-3">{intl.get('price')}</div>
                        <div className="order-col order-col-4">{intl.get('avgPrice')}</div>
                        <div className="order-col order-col-5">{intl.get('amt')}</div>
                        <div className="order-col order-col-6">{intl.get('trades')}</div>
                        <div className="order-col order-col-7">{intl.get('operation')}</div>
                    </div>

                    {this.state.data.map((item, i) => {
                        return (
                            <div className={'order-item clearfix ' + (i%2 === 1 ? 'order-even-row' : '')} key={i}>
                                <div className="order-col order-col-1">
                                    <img className="order-direction"
                                         src={item.tradeType === 1 ? directionBuyImg : directionSellerImg}
                                         alt=""/>{item.targetCoinCode}/{item.marketCoinCode}
                                </div>
                                <div className="order-col order-col-2">{parseTime(item.orderTime)}</div>
                                <div
                                    className="order-col order-col-3">{item.orderType === 1 ? intl.get('marketPrice') : item.price}</div>
                                <div className="order-col order-col-4">{item.averagePrice}</div>
                                <div
                                    className="order-col order-col-5">{item.orderType === 1 ? intl.get('marketPrice') : item.quantity}</div>
                                <div className="order-col order-col-6">{item.dealQuantity}</div>
                                <div className="order-col order-col-7">
                                    {item.status === 0 && (
                                        <a href="javascript:" className="oper-cancel"
                                           onClick={this.cancelOrder.bind(this, item.id)}>{intl.get('revocation')}</a>
                                    )}
                                    {item.status !== 0 && (
                                        <span className="status-canceled">{getOrderStatus(item.status)}</span>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {isLogin() && this.state.data.length === 0 && (
                        <div className="empty">
                            {intl.get('noData')}
                        </div>
                    )}

                    {!isLogin() && (
                        <div className="empty">
                            {intl.get('notLoginTip')} <a href="register.html?from=deal">{intl.get('register')}</a> | <a
                            href="login.html">{intl.get('login')}</a>
                        </div>
                    )}
                </div>

                <Modal
                    className="modal-confirm-davao"
                    visible={this.state.visible}
                    width={290}
                    onOk={this.confirm.bind(this)}
                    onCancel={this.cancel.bind(this)}
                    footer={[
                        <Button key="back" className="btn-cancel"
                                onClick={this.cancel.bind(this)}>{intl.get('cancelBtn')}</Button>,
                        <Button key="submit" className="btn-submit" type="primary" loading={this.state.loading}
                                onClick={this.confirm.bind(this)}>
                            {intl.get('confirmBtn')}
                        </Button>,
                    ]}
                >
                    <div className="davao-confirm-wrap">
                        <div className="title simple">{intl.get('tipCancelEntrustOrder')}</div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default User;