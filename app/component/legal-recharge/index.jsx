import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin} from 'antd'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH} from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import '@/public/css/legal-recharge.pcss';
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import videoDemoImg from '@/public/img/register-video-demo.png'
import {getCountryList, saveBasicAuthInfo, savePicAuthInfo, queryAuthInfo, getAuthTypeList, getAuthVideoCode} from '@/api'
import Box from '@/component/common/ui/Box'
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

function beforeVideoUpload(file) {
    const isVideo = file.type.indexOf('video') >= 0;
    if (!isVideo) {
        message.error('Please upload video');
    }
    // const isLt5M = file.size / 1024 / 1024 < 5;
    // if (!isLt5M) {
    //     message.error(intl.get('pic5MTip'));
    // }
    return isVideo;
}

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            def: {
                authType: 1
            },
            countryList: [],
            authTypeList: [],
            previewVisible: false,
            previewImage: '',
            picSignHover: false,
            picSignError: '',
            picSignImgUrl: '',
            picOneHover: false,
            picOneError: '',
            picOneImgUrl: '',
            picTwoHover: false,
            picTwoError: '',
            picTwoImgUrl: '',
            picThreeHover: false,
            picThreeError: '',
            picThreeImgUrl: '',
            picList: [],
            from: '',
            videoUrl: '',
            videoError: '',
            videoCode: ''
        }
    }

    componentDidMount() {
        this.setState({
            from: getSearchPara('from')
        })
        getCountryList().then(res => {
            this.setState({
                countryList: res.data
            })
        })
        // queryAuthInfo().then(res => {
        //     if(res.data) {
        //         // const data = kebabCaseData2Camel(res.data)
        //         const data = res.data
        //         this.setState(Object.assign({}, {
        //             def: Object.assign(this.state.def, data),
        //             picSignImgUrl: data.specimen_signature,
        //             picOneImgUrl: data.credential_front_pic_addr,
        //             picTwoImgUrl: data.credential_back_pic_addr,
        //             picThreeImgUrl: data.credential_sign_pic_addr
        //         }))
        //     }
        // })
        getAuthTypeList().then(res => {
            this.setState({
                authTypeList: res.data
            })
        })

        if(getSearchPara('from') === 'question') {
            getAuthVideoCode().then(res => {
                this.setState({
                    videoCode: res.data.headingCode
                })
            })
        }
    }

    handleChange(imgUrl, info) {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            const state = {loading: false}
            state[imgUrl] = info.file.response.data.fileUrl
            this.setState(state)
        }
    }

    handleVideoChange(info) {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            const state = {loading: false}
            state.videoUrl = info.file.response.data.fileUrl
            this.setState(state)
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

        return amountValid && numberValid
    }

    storeBasicInfo() {
        const para = {
            fullName: this.refs['fullName'].getValue(),
            birthday: this.refs['birthday'].getValue(),
            placeBirth: this.refs['birthPlace'].getValue(),
            address: this.refs['presentAddr'].getValue(),
            premanentAddress: this.refs['premanentAddr'].getValue(),
            sourceFunds: this.refs['fundsSource'].getValue(),
            natureWork: this.refs['workNature'].getValue(),
            organizationName: this.refs['companyName'].getValue(),
            taxIdentificationNumber: this.refs['tin'].getValue(),
            // sssGsis: this.refs['sssNo'].getValue(),
            postalCode: this.refs['postalCode'].getValue(),
            countryAreaId: this.refs['nationality'].getValue()
            // specimenSignature: this.state.picSignImgUrl,
        }
        setSessionData('authBasicData', para)
    }

    submitInfo() {
        const para = getSessionData('authBasicData')
        return new Promise((resolve, reject) => {
            saveBasicAuthInfo(para).then(res => {
                resolve()
            }, error => {
                this.setState({
                    loading: false
                })
            })
        })
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

    submit() {
        if (this.validateHighInfo()) {
            this.setState({
                loading: true
            })
            this.submitInfo().then(() => {
                return this.submitPic()
            // }).then(() => {
            //     return refreshAccountInfo()
            }).then(() => {
                this.setState({
                    loading: false
                })
                ui.tip({
                    msg: 'Register success!',
                    width: 230,
                    callback: () => {
                        jumpUrl('index.html')
                    }
                })
            })
        }
    }

    handleNext() {
        if (this.validateBasicInfo()) {
            jumpUrl('legal-recharge.html?isSubmit=true')
        }
    }
    handleSubmit() {
        if (this.validateHighInfo()) {
            jumpUrl('user.html')
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
                            The daily cutoff time for deposit is in line with Banking Business Hour 17:00 Hong Kong time.
                            Customer's deposit will be reflected in his/her account immediately when money is received on or before 17:00. Otherwise,it will be possessed on the next business day.
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
                                           options={this.state.countryList} optValue="id" optLabel="country_name"/>
                            </div>
                            <div className="clearfix">
                                <BoxSelect ref="account" className="auth-box"
                                           placeholder="Our company name（Note: Our company name is a subsidiary wholly owned in trust by..."
                                           validates={['isSelect']} defaultValue={this.state.def.account}
                                           options={this.state.countryList} optValue="id" optLabel="country_name"/>
                            </div>

                            <div className="bank-info">
                                <div className="bank-info-label">Payee</div>
                                <div className="value">
                                    Our company name（Note: Our company name is a subsidiary wholly owned in trust by Coinsuper Fintech (HK) Co. Ltd.）
                                </div>
                                <div className="bank-info-label">Payee address</div>
                                <div className="value">
                                    Level 16 Man Yee Building, 68 Des Voeux Road Central, Central, Hong Kong
                                </div>
                                <div className="bank-info-label">Account receivable account /IBAN</div>
                                <div className="value">
                                    8339001346（HKD Current Account）
                                </div>
                                <div className="bank-info-label">Beneficiary bank</div>
                                <div className="value">
                                    Dah Sing Bank, Limited
                                </div>
                                <div className="bank-info-label">Beneficiary bank address</div>
                                <div className="value">
                                    Shop No. 10, 1st Floor of the Podium, Admiralty Centre, No. 18 Harcourt Road, Admiralty
                                </div>
                                <div className="bank-info-label">Beneficiary bank SWIFT</div>
                                <div className="value">
                                    DSBAHKHH
                                </div>
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
                                <Box ref="amount" className="auth-box-left" placeholder="Deposit amount"
                                     validates={['notNull']} defaultValue={this.state.def.amount}/>
                                <Box ref="number" className="auth-box-right"
                                     placeholder="Bank Account Number" validates={['notNull']}
                                     defaultValue={this.state.def.number}/>
                            </div>
                            <div className="record-tip">
                                The remittance voucher must display a clear bank name, account holder's name, account number and amount. Please upload colorful, clear jpeg, png, jpg or pdf files up to 5MB in size.
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