import React from 'react';
import intl from 'react-intl-universal'
import { Icon, Modal, Button, Upload, message, Spin } from 'antd'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH } from '@/utils'
import { setSessionData, getSessionData, removeSessionData } from '@/data'
import '@/public/css/auth.pcss';
import previewImg from '@/public/img/放大镜up.png'
import { getCountryList, saveBasicAuthInfo, savePicAuthInfo, queryAuthInfo, getAuthTypeList } from '@/api'
import Box from '@/component/common/ui/Box'
import BoxDate from '@/component/common/ui/BoxDate'
import BoxSelect from '@/component/common/ui/BoxSelect'

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
            picThreeImgUrl: ''
        }
    }

    componentDidMount() {
        getCountryList().then(res => {
            this.setState({
                countryList: res.data
            })
        })
        queryAuthInfo().then(res => {
            if(res.data) {
                // const data = kebabCaseData2Camel(res.data)
                const data = res.data
                this.setState(Object.assign({}, {
                    def: Object.assign(this.state.def, data),
                    picSignImgUrl: data.specimen_signature,
                    picOneImgUrl: data.credential_front_pic_addr,
                    picTwoImgUrl: data.credential_back_pic_addr,
                    picThreeImgUrl: data.credential_sign_pic_addr
                }))
            }
        })
        getAuthTypeList().then(res => {
            this.setState({
                authTypeList: res.data
            })
        })
    }

    handleChange(imgUrl, info) {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            const state = {loading: false}
            state[imgUrl] = info.file.response.data.fileUrl
            this.setState(state)
        }
    }

    validateAll() {
        const fullNameValid = this.refs['fullName'].validate()
        const birthdayValid = this.refs['birthday'].validate()
        const birthPlaceValid = this.refs['birthPlace'].validate()
        const presentAddrValid = this.refs['presentAddr'].validate()
        const premanentAddrValid = this.refs['premanentAddr'].validate()
        const nationalityValid = this.refs['nationality'].validate()
        const postalCodeValid = this.refs['postalCode'].validate()

        const fundsSourceValid = this.refs['fundsSource'].validate()
        const workNatureValid = this.refs['workNature'].validate()
        const companyNameValid = this.refs['companyName'].validate()
        const tinValid = this.refs['tin'].validate()
        const sssNoValid = this.refs['sssNo'].validate()

        const picSignValid = !!this.state.picSignImgUrl

        const authTypeValid = this.refs['authType'].validate()
        const countryCredentialsIdValid = this.refs['countryCredentialsId'].validate()
        const picOneValid = !!this.state.picOneImgUrl
        const picTwoValid = !!this.state.picTwoImgUrl
        const picThreeValid = !!this.state.picThreeImgUrl
        this.setState({
            picSignError: picSignValid ? '' : intl.get('uploadPhotoTip'),
            picOneError: picOneValid ? '' : intl.get('uploadPhotoTip'),
            picTwoError: picTwoValid ? '' : intl.get('uploadPhotoTip'),
            picThreeError: picThreeValid ? '' : intl.get('uploadPhotoTip')
        })

        return fullNameValid && birthdayValid && postalCodeValid && birthPlaceValid && presentAddrValid && premanentAddrValid &&
            workNatureValid && companyNameValid && tinValid && sssNoValid && fundsSourceValid &&  nationalityValid &&
            authTypeValid && countryCredentialsIdValid && picOneValid && picTwoValid && picThreeValid
    }

    submitInfo() {
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
            sssGsis: this.refs['sssNo'].getValue(),
            postalCode: this.refs['postalCode'].getValue(),
            countryAreaId: this.refs['nationality'].getValue(),
            specimenSignature: this.state.picSignImgUrl,
        }
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
            credentialSignPicAddr: this.state.picThreeImgUrl
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
        if(this.validateAll()) {
            this.setState({
                loading: true
            })
            this.submitInfo().then(() => {
                this.submitPic().then((info) => {
                    ui.tip({
                        msg: info,
                        width: 230
                    })
                    this.setState({
                        loading: false
                    })
                    setTimeout(() => {
                        jumpUrl('user.html')
                    }, 3000)
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
        this.setState({ previewVisible: false })
    }
    handlePreview(url) {
        this.setState({
            previewImage: url,
            previewVisible: true,
        });
    }

    render() {
        const { picSignImgUrl, picOneImgUrl, picTwoImgUrl, picThreeImgUrl, previewVisible, previewImage } = this.state

        return (
            <Spin spinning={this.state.loading}>
                <div className="auth-page">
                    <div className="info-part">
                        <div className="tip">{intl.get('auth_1')}</div>
                        <div className="label">{intl.get('auth_2')}</div>
                        {/*基本信息*/}
                        <div className="clearfix">
                            <Box ref="fullName" className="auth-box-left" placeholder={intl.get('fullNameTip')} validates={['notNull']} defaultValue={this.state.def.full_name}/>
                            <BoxDate ref="birthday" className="auth-box-right" placeholder={intl.get('birthDateTip')} validates={['isSelect']} defaultValue={this.state.def.birthday}/>
                        </div>
                        <div className="clearfix">
                            <Box ref="birthPlace" className="auth-box-left" placeholder={intl.get('birthPlace')} validates={['notNull']} defaultValue={this.state.def.place_birth}/>
                            <Box ref="presentAddr" className="auth-box-right" placeholder={intl.get('presentAddr')} validates={['notNull']} defaultValue={this.state.def.address}/>
                        </div>
                        <div className="clearfix">
                            <Box ref="premanentAddr" className="auth-box" placeholder={intl.get('premanentAddr')} validates={['notNull']} defaultValue={this.state.def.premanent_address}/>
                        </div>
                        <div className="clearfix">
                            <BoxSelect ref="nationality" className="auth-box-left" placeholder={intl.get('nationality')}
                                       validates={['isSelect']} defaultValue={this.state.def.country_area_id}
                                       options={this.state.countryList} optValue="id" optLabel="country_name"/>
                            <Box ref="postalCode" className="auth-box-right" placeholder={intl.get('auth_6')} validates={['notNull']} defaultValue={this.state.def.postal_code}/>
                        </div>

                        {/*财务信息*/}
                        <div className="label">{intl.get('financeInfo')}</div>
                        <div className="clearfix">
                            <Box ref="fundsSource" className="auth-box-left" placeholder={intl.get('fundsSource')} validates={['notNull']} defaultValue={this.state.def.source_funds}/>
                            <Box ref="workNature" className="auth-box-right" placeholder={intl.get('workNature')} validates={['notNull']} defaultValue={this.state.def.nature_work}/>
                        </div>
                        <div className="clearfix">
                            <Box ref="companyName" className="auth-box-left" placeholder={intl.get('companyName')} validates={['notNull']} defaultValue={this.state.def.organization_name}/>
                            <Box ref="tin" className="auth-box-right" placeholder={intl.get('tin')} validates={['notNull']} defaultValue={this.state.def.tax_identification_number}/>
                        </div>
                        <div className="clearfix">
                            <Box ref="sssNo" className="auth-box-left" placeholder={intl.get('sssNo')} validates={['notNull']} defaultValue={this.state.def.sss_gsis}/>
                        </div>

                        {/*签字样本*/}
                        <div className="label">{intl.get('specimenSignature')}</div>
                        <div className="clearfix">
                            <div className="pic-item pic-sign">
                                <div className="pic" onMouseEnter={this.picEnter.bind(this, 'picSignHover')} onMouseLeave={this.picLeave.bind(this, 'picSignHover')}>
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className="pic-uploader"
                                        showUploadList={false}
                                        action={uploadUrl + 'type=2'}
                                        beforeUpload={beforeUpload}
                                        onChange={this.handleChange.bind(this, 'picSignImgUrl')}
                                    >
                                        {picSignImgUrl ? <img className="pic-value" src={picSignImgUrl} /> : <span></span>}
                                        <div className={'pic-tool ' + (this.state.picSignHover ? 'hover' : '') }>{intl.get('clickToUpload')}</div>
                                    </Upload>
                                    {picSignImgUrl && (
                                        <span className={'preview-btn ' + (this.state.picSignHover ? 'hover' : '') }
                                              onClick={this.handlePreview.bind(this, picSignImgUrl)}>
                                        <img src={previewImg} title={intl.get('clickToPreview')}/>
                                    </span>
                                    )}
                                </div>
                                <div className="pic-tip">{this.state.picSignError}</div>
                            </div>
                        </div>
                    </div>

                    {/*证件照*/}
                    <div className="pic-part">
                        <div className="auth-type-wrap">
                            <div className="label">{intl.get('auth_8')}</div>
                            <div className="clearfix">
                                <BoxSelect ref="authType" className="auth-box-left" placeholder={intl.get('auth_9')}
                                           validates={['isSelect']} defaultValue={this.state.def.auth_type}
                                           options={this.state.authTypeList} optValue="id" optLabel="auth_pathway_english"/>
                                <BoxSelect ref="countryCredentialsId" className="auth-box-right" placeholder={intl.get('auth_10')}
                                           validates={['isSelect']} defaultValue={this.state.def.country_credentials_id}
                                           options={this.state.countryList} optValue="id" optLabel="country_name"/>
                            </div>
                        </div>
                        {/*正面*/}
                        <div className="clearfix">
                            <div className="pic-item pic-one">
                                <div className="label">{intl.get('auth_11')}</div>
                                <div className="sub-label">{intl.get('auth_12')}</div>
                                <div className="pic" onMouseEnter={this.picEnter.bind(this, 'picOneHover')} onMouseLeave={this.picLeave.bind(this, 'picOneHover')}>
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className="pic-uploader"
                                        showUploadList={false}
                                        action={uploadUrl + 'type=2'}
                                        beforeUpload={beforeUpload}
                                        onChange={this.handleChange.bind(this, 'picOneImgUrl')}
                                    >
                                        {picOneImgUrl ? <img className="pic-value" src={picOneImgUrl} /> : <span></span>}
                                        <div className={'pic-tool ' + (this.state.picOneHover ? 'hover' : '') }>{intl.get('clickToUpload')}</div>
                                    </Upload>
                                    {picOneImgUrl && (
                                        <span className={'preview-btn ' + (this.state.picOneHover ? 'hover' : '') }
                                              onClick={this.handlePreview.bind(this, picOneImgUrl)}>
                                        <img src={previewImg} title={intl.get('clickToPreview')}/>
                                    </span>
                                    )}
                                </div>
                                <div className="pic-tip">{this.state.picOneError}</div>
                            </div>

                            {/*反面*/}
                            <div className="pic-item pic-two">
                                <div className="label">{intl.get('auth_13')}</div>
                                <div className="sub-label">{intl.get('auth_12')}</div>
                                <div className="pic" onMouseEnter={this.picEnter.bind(this, 'picTwoHover')} onMouseLeave={this.picLeave.bind(this, 'picTwoHover')}>
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className="pic-uploader"
                                        showUploadList={false}
                                        action={uploadUrl + 'type=3'}
                                        beforeUpload={beforeUpload}
                                        onChange={this.handleChange.bind(this, 'picTwoImgUrl')}
                                    >
                                        {picTwoImgUrl ? <img className="pic-value" src={picTwoImgUrl} /> : <span></span>}
                                        <div className={'pic-tool ' + (this.state.picTwoHover ? 'hover' : '') }>{intl.get('clickToUpload')}</div>
                                    </Upload>
                                    {picTwoImgUrl && (
                                        <span className={'preview-btn ' + (this.state.picTwoHover ? 'hover' : '') }
                                              onClick={this.handlePreview.bind(this, picTwoImgUrl)}>
                                        <img src={previewImg} title={intl.get('clickToPreview')}/>
                                    </span>
                                    )}
                                </div>
                                <div className="pic-tip">{this.state.picTwoError}</div>
                            </div>

                            {/*面部照片*/}
                            <div className="pic-item pic-three">
                                <div className="label">{intl.get('auth_14')}</div>
                                <div className="sub-label">{intl.get('auth_15')}</div>
                                <div className="pic" onMouseEnter={this.picEnter.bind(this, 'picThreeHover')} onMouseLeave={this.picLeave.bind(this, 'picThreeHover')}>
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className="pic-uploader"
                                        showUploadList={false}
                                        action={uploadUrl + 'type=4'}
                                        beforeUpload={beforeUpload}
                                        onChange={this.handleChange.bind(this, 'picThreeImgUrl')}
                                    >
                                        {picThreeImgUrl ? <img className="pic-value" src={picThreeImgUrl} /> : <span></span>}
                                        <div className={'pic-tool ' + (this.state.picThreeHover ? 'hover' : '') }>{intl.get('clickToUpload')}</div>
                                    </Upload>
                                    {picThreeImgUrl && (
                                        <span className={'preview-btn ' + (this.state.picThreeHover ? 'hover' : '') }
                                              onClick={this.handlePreview.bind(this, picThreeImgUrl)}>
                                        <img src={previewImg} title={intl.get('clickToPreview')}/>
                                    </span>
                                    )}
                                </div>
                                <div className="pic-tip">{this.state.picThreeError}</div>
                            </div>
                        </div>
                    </div>

                    <div className="submit-part">
                        <Button className="btn-submit" type="primary" onClick={this.submit.bind(this)}>
                            {intl.get('submitNow')}
                        </Button>
                    </div>

                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </div>
            </Spin>
        );
    }
}

export default Index;