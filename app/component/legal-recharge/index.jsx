import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin} from 'antd'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, parseTime} from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import '@/public/css/legal-recharge.pcss';
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import videoDemoImg from '@/public/img/register-video-demo.png'
import {legalRecharge, getRechargeAccountList} from '@/api'
import Box from '@/component/common/ui/Box'
import BoxNumber from '@/component/common/ui/BoxNumber'
import BoxDate from '@/component/common/ui/BoxDate'
import BoxSelect from '@/component/common/ui/BoxSelect'
import { refreshAccountInfo } from '@/utils/auth'
import Record from './Record'

const uploadUrl = process.env.BASE_API + '/file/public/uploadImg?'

function beforeUpload(file) {
    const isImg = file.type.indexOf('image') >= 0;
    if (!isImg) {
        message.error(intl.get('uploadPhotoTip'));
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        message.error(intl.get('pic5MTip'));
    }
    return isImg && isLt5M;
}

function formatAccountData(data) {
    const bank = {}
    const list = []
    const account = {}
    data.forEach((item, i) => {
        item.account = item.pay_account_name + ' (' + item.pay_account_number + ')'
        bank[item.bankName] = 1
        if(account[item.bankName]) {
            account[item.bankName].push(item)
        } else {
            account[item.bankName] = [item]
        }
    })
    Object.keys(bank).forEach(b => {
        list.push({
            id: b,
            bankName: b
        })
    })
    return [list, account]
}

function getInfo(id, data) {
    let item
    for(let i = 0, len = data.length; i < len; i++) {
        item = data[i]
        if(item.id === id) {
            return item.bankAccountInfo
        }
    }
    return ''
}

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bankList: [],
            accountList: [],
            accountData: [],
            loading: false,
            def: {
                authType: 1
            },
            countryList: [],
            authTypeList: [],
            previewVisible: false,
            previewImage: '',
            picList: [],
            info: '',
            picError: ''
        }
    }

    componentDidMount() {
        getRechargeAccountList().then(res => {
            const data = formatAccountData(res.data)
            this.setState({
                bankList: data[0],
                accountData: data[1]
            })
        })
    }

    bankChange(bank) {
        this.setState({
            accountList: this.state.accountData[bank]
        })

        this.refs.account.setValue(undefined)
        this.setState({
            info: ''
        })

        // if(bank) {
        //     const accountId = this.state.accountData[bank][0].id
        //     this.refs.account.setValue(accountId)
        //     this.accountChange(accountId)
        // } else {
        //     this.refs.account.setValue(undefined)
        //     this.setState({
        //         info: ''
        //     })
        // }
    }

    accountChange(accountId) {
        if(accountId) {
            this.setState({
                info: getInfo(accountId, this.state.accountList)
            })
        } else {
            this.setState({
                info: ''
            })
        }
    }

    handleAssetChange(info) {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            const state = {loading: false, picList: this.state.picList}
            state.picList.push(info.file.response.data.fileUrl)
            this.setState(state)
        }
    }

    validateBasicInfo() {
        const bankValid = this.refs['bank'].validate()
        const accountValid = this.refs['account'].validate()

        return bankValid && accountValid
    }

    validateHighInfo() {
        const amountValid = this.refs['amount'].validate()
        const numberValid = this.refs['number'].validate()
        const picValid = !!this.state.picList.length

        if(picValid) {
            this.setState({
                picError: ''
            })
        } else {
            this.setState({
                picError: 'Please upload picture'
            })
        }

        return amountValid && numberValid && picValid
    }

    submitPic() {
        const para = {
            authPathwayId: this.refs['authType'].getValue(),
            countryCredentialsId: this.refs['countryCredentialsId'].getValue(),
            credentialFrontPicAddr: this.state.picOneImgUrl,
            credentialBackPicAddr: this.state.picTwoImgUrl,
            verifyVideo: this.state.videoUrl
        }
        return new Promise((resolve, reject) => {
            savePicAuthInfo(para).then(res => {
                resolve(res.info)
            }, error => {
                this.setState({
                    loading: false
                })
            })
        })
    }

    handleNext() {
        if (this.validateBasicInfo()) {
            jumpUrl('legal-recharge.html', {
                isSubmit: true,
                accountId: this.refs.account.getValue(),
                id: getSearchPara('id')
            })
        }
    }
    handleSubmit() {
        if (this.validateHighInfo()) {
            const para = {
                amount: this.refs.amount.getValue(),
                certificate: this.state.picList.join(','),
                orderNumber: this.refs.number.getValue(),
                companyBankAccountId: getSearchPara('accountId'),
                coinId: getSearchPara('id')
            }
            legalRecharge(para).then(res => {
                ui.tip({
                    msg: intl.get('successTip'),
                    width: 230,
                    callback: () => {
                        jumpUrl('user.html')
                    }
                })
            }, error => {
                this.setState({
                    picError: error.info
                })
            })
        }
    }

    picEnter(type) {
        const state = {}
        state[type] = true
        this.setState(state)
    }

    picLeave(type) {
        const state = {}
        state[type] = false
        this.setState(state)
    }

    handleCancel() {
        this.setState({previewVisible: false})
    }

    handlePreview(url) {
        this.setState({
            previewImage: url,
            previewVisible: true,
        });
    }

    handleDelete(i) {
        let data = this.state.picList
        data.splice(i, 1)
        this.setState({
            picList: data
        });
    }

    render() {
        const {picSignImgUrl, picOneImgUrl, picTwoImgUrl, picThreeImgUrl, previewVisible, previewImage, videoUrl} = this.state

        return (
            <Spin spinning={this.state.loading}>
                <div className="legal-recharge-page">
                    <div className="tip-part">
                        <div className="tip">Please follow the remittance address belw to remit. <br/>
                            The time to deposit assets depends on the processing time of the bank. If the deposit application exceeds the working time of the bank on the same day, it may not be available until the next day.
                        </div>
                    </div>
                    {getSearchPara('isSubmit') !== 'true' && (
                        <div className="info-part bank-info-part">
                            <div className="label">Offline remittance</div>
                            {/*基本信息*/}
                            <div className="clearfix">
                                <BoxSelect ref="bank" className="auth-box-left"
                                           placeholder="Dah Sing Bank,Limited"
                                           validates={['isSelect']} defaultValue={this.state.def.bank}
                                           onChange={this.bankChange.bind(this)}
                                           options={this.state.bankList} optValue="id" optLabel="bankName"/>
                            </div>
                            <div className="clearfix">
                                <BoxSelect ref="account" className="auth-box"
                                           placeholder="Our company name（Note: Our company name is a subsidiary wholly owned in trust by..."
                                           validates={['isSelect']} defaultValue={this.state.def.account}
                                           onChange={this.accountChange.bind(this)}
                                           options={this.state.accountList} optValue="id" optLabel="companyName"/>
                            </div>

                            <div className="bank-info" dangerouslySetInnerHTML={{__html: this.state.info}}>
                                {/*<div className="bank-info-label">Payee</div>*/}
                                {/*<div className="value">*/}
                                    {/*Our company name（Note: Our company name is a subsidiary wholly owned in trust by Coinsuper Fintech (HK) Co. Ltd.）*/}
                                {/*</div>*/}
                                {/*<div className="bank-info-label">Payee address</div>*/}
                                {/*<div className="value">*/}
                                    {/*Level 16 Man Yee Building, 68 Des Voeux Road Central, Central, Hong Kong*/}
                                {/*</div>*/}
                                {/*<div className="bank-info-label">Account receivable account /IBAN</div>*/}
                                {/*<div className="value">*/}
                                    {/*8339001346（HKD Current Account）*/}
                                {/*</div>*/}
                                {/*<div className="bank-info-label">Beneficiary bank</div>*/}
                                {/*<div className="value">*/}
                                    {/*Dah Sing Bank, Limited*/}
                                {/*</div>*/}
                                {/*<div className="bank-info-label">Beneficiary bank address</div>*/}
                                {/*<div className="value">*/}
                                    {/*Shop No. 10, 1st Floor of the Podium, Admiralty Centre, No. 18 Harcourt Road, Admiralty*/}
                                {/*</div>*/}
                                {/*<div className="bank-info-label">Beneficiary bank SWIFT</div>*/}
                                {/*<div className="value">*/}
                                    {/*DSBAHKHH*/}
                                {/*</div>*/}
                            </div>
                            <div className="text-center">
                                <button className="btn btn-next" onClick={this.handleNext.bind(this)}>Next</button>
                            </div>
                        </div>
                    )}

                    {getSearchPara('isSubmit') === 'true' && (
                        <div className="asset-part">
                            <div className="label">Submit remittance record</div>
                            <div className="clearfix">
                                <Box type="number" ref="amount" className="auth-box-left" placeholder="Deposit amount"
                                     validates={['notNull']} defaultValue={this.state.def.amount}/>
                                <Box ref="number" className="auth-box-right"
                                     placeholder="Remittance number" validates={['notNull']}
                                     defaultValue={this.state.def.number}/>
                            </div>
                            <div className="record-tip">
                                The remittance voucher must display a clear bank name, account holder's name, account number and amount. Please upload colorful, clear jpeg, png, jpg files up to 5MB in size.
                            </div>
                            <div className="clearfix upload-wrap">
                                <div className="pic-list">
                                    {this.state.picList.map((pic, i) => {
                                        return (
                                            <div className="pic-item" key={i}>
                                                <div className="pic-wrap">
                                                    <img className="pic-value" src={pic}/>
                                                </div>
                                                <span className="preview-btn"
                                                      onClick={this.handlePreview.bind(this, pic)}>
                                                <img src={previewImg} title={intl.get('clickToPreview')}/>
                                            </span>
                                                <span className="preview-btn btn-delete"
                                                      onClick={this.handleDelete.bind(this, i)}>
                                                <img src={deleteImg} title={intl.get('delete')}/>
                                            </span>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="pic-item">
                                    <div className={'pic '}>
                                        <Upload
                                            name="file"
                                            listType="picture-card"
                                            className={'pic-uploader'}
                                            showUploadList={false}
                                            action={uploadUrl + 'type=4'}
                                            beforeUpload={beforeUpload}
                                            onChange={this.handleAssetChange.bind(this)}
                                        >
                                            <span></span>
                                        </Upload>
                                    </div>
                                </div>
                            </div>

                            <div className="error-line">{this.state.picError}</div>

                            <div className="text-center">
                                <button className="btn btn-next" onClick={this.handleSubmit.bind(this)}>Submit</button>
                            </div>
                        </div>
                    )}

                    <Record/>

                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                </div>
            </Spin>
        );
    }
}

export default Index;