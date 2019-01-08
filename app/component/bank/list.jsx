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
        this.setState({
            visible: true,
            toDeleteId: bank.id
        })
    }

    confirm() {
        this.setState({
            visible: false,
            loading: true
        })
        deleteBank(this.state.toDeleteId).then(res => {
            console.log(res)
            ui.tip({
                msg: 'Operation success!',
                width: 230,
                callback: () => {
                    this.loadData()
                }
            })
        })
    }

    cancel() {
        this.setState({
            visible: false
        })
    }

    render() {
        const {picSignImgUrl, picOneImgUrl, picTwoImgUrl, picThreeImgUrl, previewVisible, previewImage, videoUrl} = this.state

        return (
            <div className="bank-page">
                <Spin spinning={this.state.loading}>
                    <div className="info-part">
                        <div className="label">Payment Method</div>
                        <div className="bank-tip">For security reasons,please use your own bank account</div>
                        {this.state.data.map((bank, i) => {
                            return (
                            <div className="bank-item" key={i}>
                                <div className="currency">{bank.coin_code}</div>
                                <div className="bank-name">{bank.bankName} ({bank.country_name})</div>
                                <div className="name">{bank.pay_account_name} </div>
                                <div className="number">{bank.pay_account_number}</div>
                                <button className="btn btn-delete" onClick={this.handleDelete.bind(this, bank)}>Delete</button>
                                {bank.status === 0 && (
                                    <span className="status status-verifying">
                                        <img src={verifyingImg} alt=""/> verifying
                                    </span>
                                )}
                                {bank.status !== 0 && (
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

                <Modal
                    className="modal-confirm-davao"
                    visible={this.state.visible}
                    width={290}
                    onOk={this.confirm.bind(this)}
                    onCancel={this.cancel.bind(this)}
                    footer={[
                        <Button key="back" className="btn-cancel" onClick={this.cancel.bind(this)}>{intl.get('cancelBtn')}</Button>,
                        <Button key="submit" className="btn-submit" type="primary" loading={this.state.loading} onClick={this.confirm.bind(this)}>
                            {intl.get('confirmBtn')}
                        </Button>,
                    ]}
                >
                    <div className="davao-confirm-wrap">
                        <div className="title simple">Are you sure to delete it?</div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default List;