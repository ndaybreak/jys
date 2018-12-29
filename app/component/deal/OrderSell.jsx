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

const SEND_FLAG = 'isValidateCodeSend'

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            password: '',
            passwordMsg: '',
            loading: false
        }
    }

    componentDidMount() {
        eventProxy.on('priceSelect', price => {
            this.setState({
                price: price
            })
            this.priceBoxChange(price)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.otcPrice !== prevProps.otcPrice) {
            this.setOtcPrice()
        }
    }

    setOtcPrice() {
        const label = isLangZH() ? '￥ ' : '$ '
        const price = this.refs['priceBox'] && this.refs['priceBox'].getValue() || 0
        // const quantity = this.refs['quantityBox'] && this.refs['quantityBox'].getValue() || 0

        this.setState({
            otcPrice: label + (parseFloat(price) * this.props.otcPrice).toFixed(2)
        })
    }

    priceBoxChange(price) {
        const quantity = this.refs['quantityBox'].getValue()
        if(quantity) {
            this.setState({
                sum: price * quantity
            })
        }
        this.setOtcPrice()
    }

    quantityBoxChange(quantity) {
        if(this.props.type !== 'one') {
            return
        }
        const price = this.refs['priceBox'].getValue()
        if(price) {
            this.setState({
                sum: price * quantity
            })
        }
    }
    sumBoxChange(sum) {
        const price = this.refs['priceBox'].getValue()
        if(price) {
            this.setState({
                quantity: sum / price
            })
        }
    }

    changeTotal(percent) {
        const available = this.props.available
        if(available) {
            let quantity = (parseFloat(available) * percent).toFixed(this.props.basePrecision)
            this.setState({
                quantity: quantity
            })
            this.quantityBoxChange(quantity)
        }
    }

    validate() {
        let errorMsg
        if(this.refs['priceBox'] && !this.refs['priceBox'].validate()) {
            errorMsg = intl.get('priceTip')
        } else if(!this.refs['quantityBox'].validate()) {
            errorMsg = intl.get('amountTip')
        } else if(this.refs['sumBox'] && !this.refs['sumBox'].validate()) {
            errorMsg = intl.get('totalTip')
        } else if(this.refs['quantityBox'].getValue() < this.props.minSum) {
            errorMsg = intl.get('minTotalTip') + this.props.minSum
            this.refs['sumBox'].setInvalid()
        } else if(this.refs['quantityBox'].getValue() > this.props.available) {
            errorMsg = intl.get('availableTip')
            this.refs['quantityBox'].setInvalid()
        } else {
            errorMsg = ''
        }

        this.setState({
            errorMsg: errorMsg
        })
        if(errorMsg) {
            return false
        } else {
            return true
        }
    }

    handleSell() {
        if(this.validate()) {
            if(!this.props.hasMoneyPwd) {
                ui.tip({
                    msg: intl.get('notSetCapitalPassword')
                })
                return
            }
            this.setState({
                visible: true,
                passwordMsg: '',
                password: '',
                loading: false
            })
        }
    }

    handleCancel() {
        this.setState({
            visible: false
        })
    }

    handleOk() {
        if(this.state.password.length < 6) {
            this.setState({
                passwordMsg: intl.get('pwdTip')
            })
        } else {
            this.setState({
                confirmVisible: true,
                visible: false
            })
        }
    }

    passwordChange(val) {
        this.setState({
            password: val
        })
    }

    cancelConfirm() {
        this.setState({
            confirmVisible: false
        })
    }
    confirm() {
        this.setState({
            loading: true
        })
        let isOne = this.props.type === 'one'
        let para = {
            moneyPassword: this.state.password,
            tradeType: 2,
            orderType: isOne ? 2 : 1,
            targetCoinCode: this.props.base,
            marketCoinCode: this.props.target,
            quantity: this.refs['quantityBox'].getValue(),
            price: isOne ? this.refs['priceBox'].getValue() : 0
        }
        setSessionData('dealOrder', para)
        removeSessionData(SEND_FLAG)
        jumpUrl('validate-code.html', {
            from: 'deal',
            base: this.props.base,
            target: this.props.target
        })
        // entrustmentTrade(para).then(res => {
        //     setTimeout(() => {
        //         eventProxy.trigger('orderDone')
        //     }, 1500)
        //     this.setState({
        //         price: '',
        //         quantity: '',
        //         sum: ''
        //     })
        //     this.cancelConfirm()
        //     ui.tip({
        //         msg: intl.get('successTip')
        //     })
        // }, error => {
        //     this.cancelConfirm()
        //     ui.tip({
        //         width: 330,
        //         msg: error
        //     })
        // })
    }

    render() {
        const {type, target, targetPrecision, base, basePrecision, available} = this.props
        return (
            <div className={'info-right ' + (type === 'one' ? '' : 'info-market')}>
                <div style={{'height': '12px'}}><span className="order-error">{this.state.errorMsg}</span></div>
                {type === 'one' && (
                    <div>
                        <BoxNumber ref="priceBox" className="box-price" value={this.state.price} label={intl.get('price') + ':'} unit={target} step={targetPrecision} onChange={this.priceBoxChange.bind(this)} validates={['notNull']}/>
                        <div className="valuation">{intl.get('estimated')}: {this.state.otcPrice}</div>
                    </div>
                )}

                <BoxNumber ref="quantityBox" className="box-quantity" value={this.state.quantity} label={intl.get('amount') + ':'} unit={base} step={basePrecision} onChange={this.quantityBoxChange.bind(this)} validates={['notNull']}/>

                {type === 'one' && (
                    <BoxNumber ref="sumBox" className="box-sum" label={intl.get('total') + ':'} value={this.state.sum} unit={target} step='0.00000001' onChange={this.sumBoxChange.bind(this)} validates={['notNull']}/>
                )}

                <div className="percent-wrap clearfix">
                    <span className="percent-item" onClick={this.changeTotal.bind(this, 0.25)}>25%</span>
                    <span className="percent-item" onClick={this.changeTotal.bind(this, 0.5)}>50%</span>
                    <span className="percent-item" onClick={this.changeTotal.bind(this, 0.75)}>75%</span>
                    <span className="percent-item" onClick={this.changeTotal.bind(this, 1)}>100%</span>
                </div>

                {isLogin() && (
                    <div>
                        <div className="available-wrap clearfix">
                            {intl.get('available')}： {available} {base}
                        </div>
                        <button className="btn order-btn btn-sell" onClick={this.handleSell.bind(this)}>{intl.get('sellBtn')}</button>
                    </div>
                )}

                {!isLogin() && (
                    <div className="empty">
                        <a href="register.html">{intl.get('register')}</a> | <a href="login.html?from=deal">{intl.get('login')}</a> <span className="sell-span">{intl.get('sell')}</span>
                    </div>
                )}

                <Modal
                    className="modal-confirm-davao"
                    visible={this.state.visible}
                    width={330}
                    style={{top: 250}}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button key="back" className="btn-cancel" onClick={this.handleCancel.bind(this)}>{intl.get('cancelBtn')}</Button>,
                        <Button key="submit" className="btn-submit" type="primary" onClick={this.handleOk.bind(this)}>
                            {intl.get('confirmBtn')}
                        </Button>,
                    ]}
                >
                    <div className="davao-confirm-wrap">
                        <div className="title">{intl.get('capitalPasswordTip')}</div>
                        <div className="submit-div">
                            {this.state.visible && (
                                <ReactCodeInput className="password-value" type='text' fields={6} onChange={this.passwordChange.bind(this)}/>
                            )}
                        </div>
                        <div className="error">
                            {this.state.passwordMsg}
                        </div>
                    </div>
                </Modal>

                <Modal
                    className="modal-confirm-davao"
                    visible={this.state.confirmVisible}
                    width={330}
                    style={{top: 250}}
                    onOk={this.confirm.bind(this)}
                    onCancel={this.cancelConfirm.bind(this)}
                    footer={[
                        <Button key="back" className="btn-cancel" onClick={this.cancelConfirm.bind(this)}>{intl.get('cancelBtn')}</Button>,
                        <Button key="submit" className="btn-submit" type="primary" loading={this.state.loading} onClick={this.confirm.bind(this)}>
                            {intl.get('confirmBtn')}
                        </Button>,
                    ]}
                >
                    <div className="davao-confirm-wrap">
                        <div className="title">{intl.get('sellConfirm')}</div>
                        <div className="order-info-div clearfix">
                            <div className="label">{intl.get('trade')}</div>
                            <div className="content">{base}/{target}</div>
                        </div>
                        <div className="order-info-div clearfix">
                            <div className="label">{intl.get('orderType')}</div>
                            <div className="content">{type === 'one' ? intl.get('limitOrder') : intl.get('marketOrder')}</div>
                        </div>
                        {type === 'one' && (
                            <div className="order-info-div clearfix">
                                <div className="label">{intl.get('orderUPrice')}</div>
                                <div className="content">{this.refs['priceBox'] && this.refs['priceBox'].getValue()}</div>
                            </div>
                        )}
                        <div className="order-info-div clearfix">
                            <div className="label">{intl.get('orderAmount')}</div>
                            <div className="content">{this.refs['quantityBox'] && this.refs['quantityBox'].getValue()}</div>
                        </div>
                        {type === 'one' && (
                            <div className="order-info-div clearfix">
                                <div className="label">{intl.get('orderTotal')}</div>
                                <div className="content">{this.refs['sumBox'] && this.refs['sumBox'].getValue()}</div>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        )
    }
}

export default User;