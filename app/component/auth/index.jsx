import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin} from 'antd'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, isPdf, isAgeGreater18 } from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import '@/public/css/auth.pcss';
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import videoDemoImg from '@/public/img/register-video-demo.png'
import pdfImg from '@/public/img/icon_pdf.png'
import {getCountryList, saveBasicAuthInfo, savePicAuthInfo, queryAuthInfo, getAuthTypeList, getAuthVideoCode} from '@/api'
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
function imgOrPdfBeforeUpload(file) {
    const isImgOrPdf = file.type.indexOf('image') >= 0 || file.type.indexOf('pdf') >= 0;
    if (!isImgOrPdf) {
        message.error('Please upload photo or pdf');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        // message.error(intl.get('pic5MTip'));
        message.error('The max size of the file is 5MB');
    }
    return isImgOrPdf && isLt5M;
}

function beforeVideoUpload(file) {
    const isVideo = file.type.indexOf('video') >= 0;
    if (!isVideo) {
        message.error('Please upload video');
    }
    const isLt5M = file.size / 1024 / 1024 < 100;
    if (!isLt5M) {
        message.error('The max size of the file is 100MB');
    }
    return isVideo;
}

const formatPicList = str => {
    const list = String(str).split(',')
    const picList = []
    list.forEach(url => {
        picList.push({
            isPdf: isPdf(url),
            url: url
        })
    })
    return picList
}

const isSubmit = getSearchPara('isSubmit') === 'Y'

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
            // picOneImgUrl: 'https://hkstox.io/files/coin/e73c82e2-3dd7-4360-8eed-4bd46834053d_BNB.png',
            picOneImgUrl: '',
            picTwoHover: false,
            picTwoError: '',
            // picTwoImgUrl: 'https://hkstox.io/files/coin/e73c82e2-3dd7-4360-8eed-4bd46834053d_BNB.png',
            picTwoImgUrl: '',
            picThreeHover: false,
            picThreeError: '',
            picThreeImgUrl: '',
            // picList: [{
            //     url: 'https://hkstox.io/files/coin/e73c82e2-3dd7-4360-8eed-4bd46834053d_BNB.png',
            //     isPdf: false
            // }],
            picList: [],
            // videoUrl: 'http://192.169.232.54:8080/files/7ae60467-a938-4f12-992e-aae47e7f39ea_%E7%AC%AC%E5%8D%81%E6%9C%9F.mp4',
            videoUrl: '',
            videoError: '',
            videoCode: '',
            picError: '',
            educationList: [{
                id: 1,
                name: 'Primary or below'
            },{
                id: 2,
                name: 'Secondary'
            },{
                id: 3,
                name: 'University'
            },{
                id: 4,
                name: 'Post Graduate'
            }],
            workNatureList: [{
                id: 1,
                name: 'Employed'
            },{
                id: 2,
                name: 'Self-employed'
            },{
                id: 3,
                name: 'Student'
            },{
                id: 4,
                name: 'Retired'
            },{
                id: 5,
                name: 'Others'
            }]
        }
    }

    fillData() {
        let data = getSessionData('authBasicData')
        if(!data) {
            return
        }
        let state = {def: Object.assign(this.state.def, data)}
        state.picList = data.pictureInformation.split(',').map(url => {
            return {
                url: url,
                isPdf: isPdf(url)
            }
        })
        this.setState(state)
    }

    componentDidMount() {
        this.fillData()
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
        //             picList: formatPicList(data.picture_information)
        //             // picThreeImgUrl: data.credential_sign_pic_addr
        //         }))
        //     }
        // })
        getAuthTypeList().then(res => {
            this.setState({
                authTypeList: res.data
            })
        })

        if(isSubmit) {
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
            state.picList.push({
                isPdf: isPdf(info.file.response.data.fileUrl),
                url: info.file.response.data.fileUrl
            })
            this.setState(state)
        }
    }

    validateBasicInfo() {
        const fullNameValid = this.refs['fullName'].validate()
        const birthdayValid = this.refs['birthday'].validate()
        const birthPlaceValid = this.refs['birthPlace'].validate()
        // const presentAddrValid = this.refs['presentAddr'].validate()
        const premanentAddrValid = this.refs['premanentAddr'].validate()
        const nationalityValid = this.refs['nationality'].validate()
        const mobilePhoneCodeValid = this.refs['mobilePhoneCode'].validate()
        const mobilePhoneValid = this.refs['mobilePhone'].validate()
        const educationValid = this.refs['education'].validate()

        const fundsSourceValid = this.refs['fundsSource'].validate()
        const workNatureValid = this.refs['workNature'].validate()
        const companyNameValid = this.refs['companyName'].validate()
        const officePhoneCodeValid = this.refs['officePhoneCode'].validate()
        const officePhoneValid = this.refs['officePhone'].validate()
        const faxNoValid = this.refs['faxNo'].validate()
        const picValid = !!this.state.picList.length
        if(picValid) {
            this.setState({
                picError: ''
            })
        } else {
            this.setState({
                picError: 'Please upload picture.'
            })
        }
        //
        // const picSignValid = !!this.state.picSignImgUrl

        return fullNameValid && birthdayValid && birthPlaceValid && premanentAddrValid &&
            workNatureValid && companyNameValid && fundsSourceValid && nationalityValid && educationValid &&
            faxNoValid && picValid && mobilePhoneCodeValid && mobilePhoneValid && officePhoneCodeValid && officePhoneValid
    }

    validateHighInfo() {
        const authTypeValid = this.refs['authType'].validate()
        const countryCredentialsIdValid = this.refs['countryCredentialsId'].validate()
        const picOneValid = !!this.state.picOneImgUrl
        const picTwoValid = !!this.state.picTwoImgUrl
        // const picThreeValid = !!this.state.picThreeImgUrl
        const videoValid = !!this.state.videoUrl
        this.setState({
            // picSignError: picSignValid ? '' : intl.get('uploadPhotoTip'),
            picOneError: picOneValid ? '' : intl.get('uploadPhotoTip'),
            picTwoError: picTwoValid ? '' : intl.get('uploadPhotoTip'),
            videoError: videoValid ? '' : 'Please upload video'
            // picThreeError: picThreeValid ? '' : intl.get('uploadPhotoTip')
        })

        return authTypeValid && countryCredentialsIdValid && picOneValid && picTwoValid && videoValid
    }

    storeBasicInfo() {
        const para = {
            fullName: this.refs['fullName'].getValue(),
            birthday: this.refs['birthday'].getValue(),
            placeBirth: this.refs['birthPlace'].getValue(),
            // address: this.refs['presentAddr'].getValue(),
            premanentAddress: this.refs['premanentAddr'].getValue(),
            countryAreaId: this.refs['nationality'].getValue(),
            areaCode: this.refs['mobilePhoneCode'].getValue(),
            mobileTelephone: this.refs['mobilePhone'].getValue(),
            education: this.refs['education'].getValue(),
            sourceFunds: this.refs['fundsSource'].getValue(),
            natureWork: this.refs['workNature'].getValue(),
            organizationName: this.refs['companyName'].getValue(),
            officeAreaCode: this.refs['officePhoneCode'].getValue(),
            officeTelephone: this.refs['officePhone'].getValue(),
            officeFax: this.refs['faxNo'].getValue(),
            pictureInformation: this.state.picList.map(item => {
                return item.url
            }).join(','),
        }
        setSessionData('authBasicData', para)
    }

    submitInfo() {
        return new Promise((resolve, reject) => {
            const para = getSessionData('authBasicData')
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
            verifyVideo: this.state.videoUrl,
            headingCode: this.state.videoCode
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
                removeSessionData('authBasicData')
                ui.tip({
                    msg: 'Your KYC information send successfully and we will verify it as soon as possible.',
                    width: 300,
                    seconds: 5,
                    callback: () => {
                        jumpUrl('index.html')
                    }
                })
            })
        }
    }

    handleNext() {
        if (this.validateBasicInfo()) {
            if(!isAgeGreater18(this.refs['birthday'].getValue())) {
                ui.tip({
                    width: 300,
                    seconds: 5,
                    msg: 'Due to you are under 18 years old , you are not allowed to register.'
                })
                return
            }
            this.storeBasicInfo()
            jumpUrl('commitment-letter.html', {
                from: 'person'
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

    downloadPdf(url) {
        window.open(url)
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
                <div className="auth-page">
                    {!isSubmit && (
                        <div>
                            <div className="info-part">
                                {/*<div className="tip">{intl.get('auth_1')}</div>*/}
                                <div className="label">{intl.get('auth_2')}</div>
                                {/*基本信息*/}
                                <div className="clearfix">
                                    <Box ref="fullName" className="auth-box-left" placeholder="Name"
                                         validates={['notNull']} defaultValue={this.state.def.fullName}/>
                                    <BoxDate ref="birthday" className="auth-box-right"
                                             placeholder={intl.get('birthDateTip')} validates={['isSelect']}
                                             defaultValue={this.state.def.birthday}/>
                                </div>
                                <div className="clearfix">
                                    <Box ref="birthPlace" className="auth-box-left" placeholder={intl.get('birthPlace')}
                                         validates={['notNull']} defaultValue={this.state.def.placeBirth} maxLength={200}/>
                                    <BoxSelect ref="education" className="auth-box-right"
                                               placeholder="Education" validates={['isSelect']} defaultValue={this.state.def.education}
                                               options={this.state.educationList} optValue="id" optLabel="name"/>
                                </div>
                                <div className="clearfix">
                                    <Box ref="premanentAddr" className="auth-box"
                                         placeholder={intl.get('premanentAddr')} validates={['notNull']}
                                         defaultValue={this.state.def.premanentAddress} maxLength={200}/>
                                </div>
                                <div className="clearfix">
                                    <BoxSelect ref="nationality" className="auth-box-left"
                                               placeholder="Nationality / Citizenship"
                                               validates={['isSelect']} defaultValue={this.state.def.countryAreaId}
                                               options={this.state.countryList} optValue="id" optLabel="country_name"/>
                                    <BoxSelect ref="mobilePhoneCode" className="area-code-wrap"
                                               placeholder="Area Code"
                                               validates={['isSelect']} defaultValue={this.state.def.areaCode}
                                               options={this.state.countryList} optValue="id" optLabel="area_code"/>
                                    <Box ref="mobilePhone" type="number" className="phone-wrap" placeholder="Mobile Telephone No."
                                         validates={['notNull']} defaultValue={this.state.def.mobileTelephone}/>
                                </div>

                                {/*财务信息*/}
                                <div className="label">{intl.get('financeInfo')}</div>
                                <div className="clearfix">
                                    <Box ref="fundsSource" className="auth-box-left"
                                         placeholder={intl.get('fundsSource')} validates={['notNull']}
                                         defaultValue={this.state.def.sourceFunds}/>
                                    <BoxSelect ref="workNature" className="auth-box-right"
                                               placeholder={intl.get('workNature')}
                                               validates={['isSelect']} defaultValue={this.state.def.natureWork}
                                               options={this.state.workNatureList} optValue="id" optLabel="name"/>
                                </div>
                                <div className="clearfix">
                                    <Box ref="companyName" className="auth-box-left"
                                         placeholder="Company/Organization Name"
                                         defaultValue={this.state.def.organizationName}/>
                                    <BoxSelect ref="officePhoneCode" className="area-code-wrap"
                                               placeholder="Area Code"
                                               defaultValue={this.state.def.officeAreaCode}
                                               options={this.state.countryList} optValue="id" optLabel="area_code"/>
                                    <Box ref="officePhone" type="number" className="phone-wrap" placeholder="Office Telephone No."
                                         defaultValue={this.state.def.officeTelephone}/>
                                </div>
                                <div className="clearfix">
                                    <Box ref="faxNo" className="auth-box-left" type="number"
                                         placeholder="Office Fax No."
                                         defaultValue={this.state.def.officeFax}/>
                                </div>
                                {/*<div className="clearfix">*/}
                                {/*<Box ref="sssNo" className="auth-box-left" placeholder={intl.get('sssNo')} validates={['notNull']} defaultValue={this.state.def.sss_gsis}/>*/}
                                {/*</div>*/}

                                {/*签字样本*/}
                                {/*<div className="label">{intl.get('specimenSignature')}</div>*/}
                                {/*<div className="clearfix">*/}
                                {/*<div className="pic-item pic-sign">*/}
                                {/*<div className="pic" onMouseEnter={this.picEnter.bind(this, 'picSignHover')} onMouseLeave={this.picLeave.bind(this, 'picSignHover')}>*/}
                                {/*<Upload*/}
                                {/*name="file"*/}
                                {/*listType="picture-card"*/}
                                {/*className="pic-uploader"*/}
                                {/*showUploadList={false}*/}
                                {/*action={uploadUrl + 'type=2'}*/}
                                {/*beforeUpload={beforeUpload}*/}
                                {/*onChange={this.handleChange.bind(this, 'picSignImgUrl')}*/}
                                {/*>*/}
                                {/*{picSignImgUrl ? <img className="pic-value" src={picSignImgUrl} /> : <span></span>}*/}
                                {/*<div className={'pic-tool ' + (this.state.picSignHover ? 'hover' : '') }>{intl.get('clickToUpload')}</div>*/}
                                {/*</Upload>*/}
                                {/*{picSignImgUrl && (*/}
                                {/*<span className={'preview-btn ' + (this.state.picSignHover ? 'hover' : '') }*/}
                                {/*onClick={this.handlePreview.bind(this, picSignImgUrl)}>*/}
                                {/*<img src={previewImg} title={intl.get('clickToPreview')}/>*/}
                                {/*</span>*/}
                                {/*)}*/}
                                {/*</div>*/}
                                {/*<div className="pic-tip">{this.state.picSignError}</div>*/}
                                {/*</div>*/}
                                {/*</div>*/}
                            </div>

                            <div className="asset-part">
                                {/*Upload Asset Certificate Documents*/}
                                <div className="label">Upload Asset Certificate Documents</div>
                                <div className="tip">In principle, all electronic certification materials require
                                    Chinese or English versions. If they are not in the above two languages, please
                                    provide the official version issued by the formal translation company with personal
                                    signature or seal. <br/>Uploads must be JPEG (.jpg.jpeg.jpe.jfif and.jif), PNG or PDF
                                </div>
                                <div className="asset-info">
                                    <div>
                                        For a individual, any one or more of the following documents issued or submitted within 12 months before the relevant date—
                                    </div>
                                    <div>(1) a statement of account or a certificate issued by a custodian;</div>
                                    <div>(2) a certificate issued by an auditor or a certified public accountant;</div>
                                    <div>(3) a public filing submitted by or on behalf of the trust corporation (whether
                                        on its own behalf or in respect of a trust of which it acts as a trustee),
                                        individual, corporation or partnership.
                                    </div>
                                </div>

                                <div className="clearfix upload-wrap">
                                    <div className="pic-list">
                                        {this.state.picList.map((pic, i) => {
                                            return (
                                                <div className="pic-item" key={i}>
                                                    <div className="pic-wrap">
                                                        {pic.isPdf && (
                                                            <img className="pic-value" src={pdfImg} alt=""/>
                                                        )}
                                                        {!pic.isPdf && (
                                                            <img className="pic-value" src={pic.url}/>
                                                        )}
                                                    </div>
                                                    {pic.isPdf && (
                                                        <span className="preview-btn btn-download"
                                                              onClick={this.downloadPdf.bind(this, pic.url)}>
                                                            {/*<Icon type="download" />*/}
                                                            <img src={previewImg} title={intl.get('clickToPreview')}/>
                                                        </span>
                                                    )}
                                                    {!pic.isPdf && (
                                                        <span className="preview-btn"
                                                              onClick={this.handlePreview.bind(this, pic.url)}>
                                                            <img src={previewImg} title={intl.get('clickToPreview')}/>
                                                        </span>
                                                    )}
                                                    <span className="preview-btn btn-delete"
                                                              onClick={this.handleDelete.bind(this, i)}>
                                                    <img src={deleteImg} title={intl.get('delete')}/>
                                            </span>
                                                </div>
                                            )
                                        })}
                                        <div className="pic-item">
                                            <div className={'pic '}>
                                                <Upload
                                                    name="file"
                                                    listType="picture-card"
                                                    className={'pic-uploader'}
                                                    showUploadList={false}
                                                    action={uploadUrl + 'type=4'}
                                                    beforeUpload={imgOrPdfBeforeUpload}
                                                    onChange={this.handleAssetChange.bind(this)}
                                                >
                                                    <span></span>
                                                </Upload>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {this.state.picList.length === 0 && (
                                    <div className="error-line">{this.state.picError}</div>
                                )}

                                <div className="text-center">
                                    <button className="btn btn-next" onClick={this.handleNext.bind(this)}>Next</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/*证件照*/}
                    {isSubmit && (
                        <div className="pic-part">
                            <div className="auth-type-wrap">
                                {/*<div className="label">{intl.get('auth_8')}</div>*/}
                                <div className="clearfix">
                                    <BoxSelect ref="authType" className="auth-box-left" placeholder={intl.get('auth_9')}
                                               validates={['isSelect']} defaultValue={this.state.def.auth_type}
                                               options={this.state.authTypeList} optValue="id"
                                               optLabel="auth_pathway_english"/>
                                    <BoxSelect ref="countryCredentialsId" className="auth-box-right"
                                               placeholder={intl.get('auth_10')}
                                               validates={['isSelect']}
                                               defaultValue={this.state.def.country_credentials_id}
                                               options={this.state.countryList} optValue="id" optLabel="country_name"/>
                                </div>
                            </div>
                            {/*正面*/}
                            <div className="clearfix">
                                <div className="label">Please upload your credentials and facial photos <span className="sub-title">(size of the picture is not more than 5MB)</span></div>
                                <div className="pic-item pic-one">
                                    <div className="pic-label">{intl.get('auth_11')}</div>
                                    {/*<div className="sub-label">{intl.get('auth_12')}</div>*/}
                                    <div className="pic" onMouseEnter={this.picEnter.bind(this, 'picOneHover')}
                                         onMouseLeave={this.picLeave.bind(this, 'picOneHover')}>
                                        <Upload
                                            name="file"
                                            listType="picture-card"
                                            className="pic-uploader"
                                            showUploadList={false}
                                            action={uploadUrl + 'type=2'}
                                            beforeUpload={beforeUpload}
                                            onChange={this.handleChange.bind(this, 'picOneImgUrl')}
                                        >
                                            {picOneImgUrl ? <img className="pic-value" src={picOneImgUrl}/> :
                                                <span></span>}
                                            <div
                                                className={'pic-tool ' + (this.state.picOneHover ? 'hover' : '')}>{intl.get('clickToUpload')}</div>
                                        </Upload>
                                        {picOneImgUrl && (
                                            <span className={'preview-btn ' + (this.state.picOneHover ? 'hover' : '')}
                                                  onClick={this.handlePreview.bind(this, picOneImgUrl)}>
                                        <img src={previewImg} title={intl.get('clickToPreview')}/>
                                    </span>
                                        )}
                                    </div>
                                    <div className="pic-tip">{this.state.picOneError}</div>
                                </div>

                                {/*反面*/}
                                <div className="pic-item pic-two">
                                    <div className="pic-label">{intl.get('auth_13')}</div>
                                    {/*<div className="sub-label">{intl.get('auth_12')}</div>*/}
                                    <div className="pic" onMouseEnter={this.picEnter.bind(this, 'picTwoHover')}
                                         onMouseLeave={this.picLeave.bind(this, 'picTwoHover')}>
                                        <Upload
                                            name="file"
                                            listType="picture-card"
                                            className="pic-uploader"
                                            showUploadList={false}
                                            action={uploadUrl + 'type=3'}
                                            beforeUpload={beforeUpload}
                                            onChange={this.handleChange.bind(this, 'picTwoImgUrl')}
                                        >
                                            {picTwoImgUrl ? <img className="pic-value" src={picTwoImgUrl}/> :
                                                <span></span>}
                                            <div
                                                className={'pic-tool ' + (this.state.picTwoHover ? 'hover' : '')}>{intl.get('clickToUpload')}</div>
                                        </Upload>
                                        {picTwoImgUrl && (
                                            <span className={'preview-btn ' + (this.state.picTwoHover ? 'hover' : '')}
                                                  onClick={this.handlePreview.bind(this, picTwoImgUrl)}>
                                        <img src={previewImg} title={intl.get('clickToPreview')}/>
                                    </span>
                                        )}
                                    </div>
                                    <div className="pic-tip">{this.state.picTwoError}</div>
                                </div>

                                {/*面部照片*/}
                                {/*<div className="pic-item pic-three">*/}
                                    {/*<div className="label">{intl.get('auth_14')}</div>*/}
                                    {/*<div className="sub-label">{intl.get('auth_15')}</div>*/}
                                    {/*<div className="pic" onMouseEnter={this.picEnter.bind(this, 'picThreeHover')}*/}
                                         {/*onMouseLeave={this.picLeave.bind(this, 'picThreeHover')}>*/}
                                        {/*<Upload*/}
                                            {/*name="file"*/}
                                            {/*listType="picture-card"*/}
                                            {/*className="pic-uploader"*/}
                                            {/*showUploadList={false}*/}
                                            {/*action={uploadUrl + 'type=4'}*/}
                                            {/*beforeUpload={beforeUpload}*/}
                                            {/*onChange={this.handleChange.bind(this, 'picThreeImgUrl')}*/}
                                        {/*>*/}
                                            {/*{picThreeImgUrl ? <img className="pic-value" src={picThreeImgUrl}/> :*/}
                                                {/*<span></span>}*/}
                                            {/*<div*/}
                                                {/*className={'pic-tool ' + (this.state.picThreeHover ? 'hover' : '')}>{intl.get('clickToUpload')}</div>*/}
                                        {/*</Upload>*/}
                                        {/*{picThreeImgUrl && (*/}
                                            {/*<span className={'preview-btn ' + (this.state.picThreeHover ? 'hover' : '')}*/}
                                                  {/*onClick={this.handlePreview.bind(this, picThreeImgUrl)}>*/}
                                        {/*<img src={previewImg} title={intl.get('clickToPreview')}/>*/}
                                    {/*</span>*/}
                                        {/*)}*/}
                                    {/*</div>*/}
                                    {/*<div className="pic-tip">{this.state.picThreeError}</div>*/}
                                {/*</div>*/}

                                <div className="video-wrap">
                                    <div className="label">Please Upload The Video File</div>
                                    <div className="video-tip">
                                        <div>Video file content includes: </div>
                                        <div>(1).Clear display of the applicant's face</div>
                                        <div>(2).Hand-held ID Personal Information Page + Handwritten Signature (Date and Time) </div>
                                        <div>(3).Read aloud the 6 digits randomly generated by the platform and "I promise that all the certificates and materials I submit are true, complete, legal and effective. I have understood and agreed with the investment risks revealed in the User's Commitment and promised to have the corresponding risk tolerance.</div>
                                    </div>
                                    <div className="video-code">{this.state.videoCode}</div>
                                    <div className="video-content">
                                        {!videoUrl && (
                                            <img src={videoDemoImg} alt="" className="video-demo-img"/>
                                        )}
                                        {videoUrl && (
                                            <video className="video" src={videoUrl} controls="controls" width="383px" height="219px"></video>
                                        )}
                                        <div>
                                            <span className="pic-tip" style={{float: 'left',marginTop: '15px'}}>{this.state.videoError}</span>
                                            <Upload
                                                name="file"
                                                className="upload-video-wrap"
                                                showUploadList={false}
                                                action={uploadUrl + 'type=4'}
                                                beforeUpload={beforeVideoUpload}
                                                onChange={this.handleVideoChange.bind(this)}
                                            >
                                                <Button className="btn-video-upload">
                                                    <Icon type="upload" /> Click to Upload
                                                </Button>
                                            </Upload>
                                        </div>

                                        <Button className="btn-submit" type="primary" onClick={this.submit.bind(this)}>Submit</Button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/*<div className="submit-part">*/}
                        {/**/}
                    {/*</div>*/}

                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                </div>
            </Spin>
        );
    }
}

export default Index;