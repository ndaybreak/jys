import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin} from 'antd'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH} from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import '@/public/css/bank-add.pcss';
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import videoDemoImg from '@/public/img/register-video-demo.png'
import {getCountryList, saveBasicAuthInfo, savePicAuthInfo, queryAuthInfo, getAuthVideoCode, getCoinList, saveOrUpdatePayAccountInfo } from '@/api'
import Box from '@/component/common/ui/Box'
import BoxDate from '@/component/common/ui/BoxDate'
import BoxSelect from '@/component/common/ui/BoxSelect'
import { refreshAccountInfo } from '@/utils/auth'

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

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            def: {
                authType: 1
            },
            countryList: [],
            previewVisible: false,
            previewImage: '',
            picList: [],
            from: '',
            videoUrl: '',
            videoError: '',
            videoCode: '',
            picError: '',
            currencyList: []
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
        getCoinList({isVC: 2}).then(res => {
            this.setState({
                currencyList: res.data
            })
        })
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
        const fullNameValid = this.refs['fullName'].validate()
        const nameValid = this.refs['name'].validate()
        const currencyValid = this.refs['currency'].validate()
        const countryValid = this.refs['country'].validate()
        const numberValid = this.refs['number'].validate()

        const picValid = !!this.state.picList.length
        if(picValid) {
            this.setState({
                picError: ''
            })
        } else {
            this.setState({
                picError: 'Please upload'
            })
        }

        return fullNameValid && nameValid && currencyValid && countryValid && numberValid && picValid
    }

    handleSubmit() {
        if (this.validateBasicInfo()) {
            const para = {
                id: getSearchPara('id'),
                payType: '0',
                payAccountName: this.refs['fullName'].getValue(),
                payAccountNumber: this.refs['number'].getValue(),
                bankName: this.refs['name'].getValue(),
                coinId: this.refs['currency'].getValue(),
                countryId: this.refs['country'].getValue(),
                certificate: this.state.picList.join(',')
            }
            this.setState({
                loading: true
            })
            saveOrUpdatePayAccountInfo(para).then(res => {
                this.setState({
                    loading: false
                })
                ui.tip({
                    msg: 'Operation success!',
                    width: 230,
                    callback: () => {
                        jumpUrl('user.html')
                    }
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
        const { previewVisible, previewImage } = this.state

        return (
            <Spin spinning={this.state.loading}>
                <div className="bank-page">
                    <div className="info-part bank-info-part">
                        <div className="label">Link your bank account</div>
                        {/*基本信息*/}
                        <div className="clearfix">
                            <Box ref="name" className="auth-box" placeholder="Bank Name"
                                 validates={['notNull']} defaultValue={this.state.def.name}/>
                        </div>
                        <div className="clearfix">
                            <BoxSelect ref="currency" className="auth-box-left"
                                       placeholder="Currency"
                                       validates={['isSelect']} defaultValue={this.state.def.currency}
                                       options={this.state.currencyList} optValue="id" optLabel="coin_code"/>
                            <BoxSelect ref="country" className="auth-box-right"
                                       placeholder="Bank's Country/Region"
                                       validates={['isSelect']} defaultValue={this.state.def.country}
                                       options={this.state.countryList} optValue="id" optLabel="country_name"/>
                        </div>
                        <div className="clearfix">
                            <Box ref="fullName" className="auth-box-left" placeholder="Full Name of Account Holder"
                                 validates={['notNull']} defaultValue={this.state.def.fullName}/>
                            <Box ref="number" className="auth-box-right"
                                 placeholder="Bank Account Number" validates={['notNull']}
                                 defaultValue={this.state.def.number}/>
                        </div>

                    </div>

                    <div className="asset-part">
                        {/*Upload Asset Certificate Documents*/}
                        <div className="label">Upload Asset Certificate Documents</div>
                        <div className="tip">Stox requires the bank card account number and the name on the bank card be the same as the real name linked to your account. Otherwise, currency withdrawal is not allowed.
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

                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                </div>
            </Spin>
        );
    }
}

export default Index;