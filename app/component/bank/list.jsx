import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin} from 'antd'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH} from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import '@/public/css/bank-list.pcss';
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import videoDemoImg from '@/public/img/register-video-demo.png'
import verifyingImg from '@/public/img/icon_verifying.png'
import verifiedImg from '@/public/img/icon_verified.png'
import {
    getCountryList,
    saveBasicAuthInfo,
    savePicAuthInfo,
    queryAuthInfo,
    getAuthTypeList,
    getAuthVideoCode,
    getBankList,
    deleteBank
} from '@/api'
import Box from '@/component/common/ui/Box'
import BoxDate from '@/component/common/ui/BoxDate'
import BoxSelect from '@/component/common/ui/BoxSelect'
import {refreshAccountInfo} from '@/utils/auth'

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            visible: false,
            toDeleteId: ''
        }
    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        this.setState({
            loading: true
        })
        getBankList().then(res => {
            this.setState({
                data: res.data,
                loading: false
            })
        })
    }

    addBank() {
        jumpUrl('bank-add.html')
    }

    handleDelete(bank) {
        ui.confirm({
            msg: 'Are you sure to delete it?',
            onOk: () => {
                removeSessionData('isValidateCodeSend')
                jumpUrl('validate-code.html', {
                    from: 'bank-list',
                    id: bank.id
                })
                // deleteBank(bank.id).then(res => {
                //     console.log(res)
                //     ui.tip({
                //         msg: 'Operation success!',
                //         width: 230,
                //         callback: () => {
                //             this.loadData()
                //         }
                //     })
                // })
            }
        })
    }

    render() {
        return (
            <div className="bank-page">
                <Spin spinning={this.state.loading}>
                    <div className="info-part">
                        <div className="label">Payment Method</div>
                        <div className="bank-tip">For security reasons, please use your own bank account</div>
                        {this.state.data.map((bank, i) => {
                            return (
                            <div className="bank-item" key={i}>
                                <div className="currency">{bank.coin_code}</div>
                                <div className="bank-name">{bank.bankName} ({bank.country_name})</div>
                                <div className="name">{bank.pay_account_name} </div>
                                <div className="number">{bank.pay_account_number}</div>
                                <button className="btn btn-delete" onClick={this.handleDelete.bind(this, bank)}>Delete</button>
                                {bank.status !== 3 && (
                                    <span className="status status-verifying">
                                        <img src={verifyingImg} alt=""/> verifying
                                    </span>
                                )}
                                {bank.status === 3 && (
                                    <span className="status status-verified">
                                        <img src={verifiedImg} alt=""/> verified
                                    </span>
                                )}
                            </div>
                            )
                        })}
                        <button className="btn btn-add" onClick={this.addBank.bind(this)}></button>
                    </div>
                </Spin>
            </div>
        );
    }
}

export default List;