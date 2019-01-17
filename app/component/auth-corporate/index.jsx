import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin} from 'antd'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, isPdf} from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import '@/public/css/auth-corporate.pcss';
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import videoDemoImg from '@/public/img/register-video-demo.png'
import pdfImg from '@/public/img/icon_pdf.png'
import {getCountryList, saveCompanyBasicAuthInfo, saveCompanyPicAuthInfo, queryCompanyAuthInfo, getAuthTypeList, getAuthVideoCode} from '@/api'
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
    // const isLt5M = file.size / 1024 / 1024 < 5;
    // if (!isLt5M) {
    //     message.error(intl.get('pic5MTip'));
    // }
    return isVideo;
}

const directorDefault = {
    name: '',
    residentialAddress: '',
    incorpration: '',
    directorShareholder: '',
    shareholding: ''
}

const isSubmit = getSearchPara('isSubmit') === 'Y'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            def: {
                authType: 1,
                source_funds: '',
                nature_work: '',
                organization_name: '',
                tax_identification_number: ''
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
            //     isPdf: false,
            //     url: 'https://hkstox.io/files/coin/e73c82e2-3dd7-4360-8eed-4bd46834053d_BNB.png'
            // }],
            picList: [],
            // videoUrl: 'http://192.169.232.54:8080/files/7ae60467-a938-4f12-992e-aae47e7f39ea_%E7%AC%AC%E5%8D%81%E6%9C%9F.mp4',
            videoUrl: '',
            videoError: '',
            videoCode: '',
            infoList: [Object.assign({}, directorDefault)],
            institutionList: [{
                id: 1,
                value: 'Financial Institution'
            }, {
                id: 2,
                value: 'Active NFE'
            }, {
                id: 3,
                value: 'Passive NFE'
            }],
            bankList: [],
            bankData: [[{
                id: 1,
                value: 'Bank'
            }, {
                id: 2,
                value: 'Asset/ Fund Management'
            }, {
                id: 3,
                value: 'Operator Stock Broking '
            }, {
                id: 4,
                value: 'Fund'
            }, {
                id: 5,
                value: 'Insurance Company'
            }, {
                id: 6,
                value: ' Financial Market'
            }, {
                id: 7,
                value: ' Nominees/ Custodian'
            }], [{
                id: 8,
                value: 'Listed on Exchange'
            }, {
                id: 9,
                value: 'Government firm / Agency'
            }, {
                id: 10,
                value: 'Other active NFE'
            }], [{
                id: 11,
                value: 'Financial Institution and located in non-participating jurisdiction'
            }, {
                id: 12,
                value: 'NFE that is not an active NFE'
            }]],
            authorizedName: '',
            position: '',
            mobile: '',
            passport: '',
            behalfError: ''
        }
    }

    componentDidMount() {
        this.setState({
            bankList: this.state.bankData[0]
        })
        getCountryList().then(res => {
            this.setState({
                countryList: res.data
            })
        })
        // queryCompanyAuthInfo().then(res => {
        //     if(res.data) {
        //         // const data = kebabCaseData2Camel(res.data)
        //         const data = res.data
        //         this.setState(Object.assign({}, {
        //             def: Object.assign(this.state.def, data),
        //             picSignImgUrl: data.specimen_signature,
        //             picOneImgUrl: data.credential_front_pic_addr,
        //             picTwoImgUrl: data.credential_back_pic_addr
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
        const companyNameValid = this.refs['companyName'].validate()
        const natureWorkValid = this.refs['natureWork'].validate()
        const contactPersonValid = this.refs['contactPerson'].validate()
        const registeredAddressValid = this.refs['registeredAddress'].validate()
        const companyRegistrationDateValid = this.refs['companyRegistrationDate'].validate()
        const companyRegistrationNumberValid = this.refs['companyRegistrationNumber'].validate()
        const contactAddressValid = this.refs['contactAddress'].validate()
        const areaCodeValid = this.refs['areaCode'].validate()
        const contactNumberValid = this.refs['contactNumber'].validate()
        const corporationTypeValid = this.refs['corporationType'].validate()
        const bankValid = this.refs['bank'].validate()
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

        const behalfValid = this.state.authorizedName || this.state.position || this.state.mobile || this.state.passport
        if(behalfValid) {
            this.setState({
                behalfError: ''
            })
        } else {
            this.setState({
                behalfError: 'Please enter'
            })
        }

        return companyNameValid && companyRegistrationDateValid && contactNumberValid && registeredAddressValid && contactAddressValid &&
            companyNameValid && contactPersonValid && natureWorkValid && corporationTypeValid && bankValid && companyRegistrationNumberValid
            && picValid && behalfValid && areaCodeValid
    }

    validateHighInfo() {
        const authTypeValid = this.refs['authType'].validate()
        const countryCredentialsIdValid = this.refs['countryCredentialsId'].validate()
        const picOneValid = !!this.state.picOneImgUrl
        const picTwoValid = !!this.state.picTwoImgUrl
        const videoValid = !!this.state.videoUrl
        this.setState({
            picOneError: picOneValid ? '' : intl.get('uploadPhotoTip'),
            picTwoError: picTwoValid ? '' : intl.get('uploadPhotoTip'),
            videoError: videoValid ? '' : 'Please upload video'
        })

        return authTypeValid && countryCredentialsIdValid && picOneValid && picTwoValid && videoValid
    }

    storeBasicInfo() {
        const para = {
            name: this.refs['companyName'].getValue(),
            natureWork: this.refs['natureWork'].getValue(),
            liaisonPerson: this.refs['contactPerson'].getValue(),
            registeredAddress: this.refs['registeredAddress'].getValue(),
            companyRegistrationDate: this.refs['companyRegistrationDate'].getValue(),
            companyRegistrationNumber: this.refs['companyRegistrationNumber'].getValue(),
            areaCodeId: this.refs['areaCode'].getValue(),
            contactAddress: this.refs['contactAddress'].getValue(),
            contactNumber: this.refs['contactNumber'].getValue(),
            code: this.refs['corporationType'].getValue(),
            bank: this.refs['bank'].getValue(),
            authorizedName: this.state.authorizedName,
            position: this.state.position,
            mobile: this.state.mobile,
            passport: this.state.passport,
            explainInfo: this.state.explainInfo,
            list: this.state.infoList
        }
        setSessionData('authBasicData', para)
    }

    submitInfo() {
        return new Promise((resolve, reject) => {
            const para = getSessionData('authBasicData')
            saveCompanyBasicAuthInfo(para).then(res => {
                debugger
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
            saveCompanyPicAuthInfo(para).then(res => {
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
                this.submitPic().then((info) => {
                    debugger
                    ui.tip({
                        msg: 'Register success!',
                        width: 230,
                        callback: () => {
                            jumpUrl('index.html')
                        }
                    })
                })
            })
        }
    }

    handleNext() {
        if (this.validateBasicInfo()) {
            this.storeBasicInfo()
            jumpUrl('commitment-letter.html', {
                from: 'corporate'
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

    addTr() {
        this.setState({
            infoList: this.state.infoList.concat([Object.assign({}, directorDefault)])
        })
    }

    institutionChange(key) {
        this.setState({
            bankList: this.state.bankData[key]
        })
    }

    directorChange(key, i, e) {
        const list = this.state.infoList
        list[i][key] = e.target.value
        this.setState({
            infoList: list
        })
    }

    inputChange(key, e) {
        const state = {}
        state[key] = e.target.value
        this.setState(state)
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
                                <div className="label">Basic Company Information</div>
                                {/*基本信息*/}
                                <div className="clearfix">
                                    <Box ref="companyName" className="auth-box-left" placeholder="Company Name"
                                         validates={['notNull']} defaultValue={this.state.def.name}/>
                                    <Box ref="natureWork" className="auth-box-right" placeholder="Nature of Business"
                                         validates={['notNull']} defaultValue={this.state.def.natureWork}/>
                                </div>
                                <div className="clearfix">
                                    <Box ref="contactPerson" className="auth-box-left" placeholder="Contact Person"
                                         validates={['notNull']} defaultValue={this.state.def.incorpration}/>
                                    <Box ref="registeredAddress" className="auth-box-right"
                                         placeholder="Registered Address" validates={['notNull']}
                                         defaultValue={this.state.def.registeredAddress}/>
                                </div>
                                <div className="clearfix">
                                    <BoxDate ref="companyRegistrationDate" className="auth-box-left"
                                             placeholder="Date of Incorporation" validates={['isSelect']}
                                             defaultValue={this.state.def.companyRegistrationDate}/>
                                    <Box ref="companyRegistrationNumber" className="auth-box-right"
                                         placeholder="Certificate Incorporation No." validates={['notNull']}
                                         defaultValue={this.state.def.companyRegistrationNumber}/>
                                </div>
                                <div className="clearfix">
                                    <Box ref="contactAddress" className="auth-box-left"
                                         placeholder="Email Address" validates={['notNull']}
                                         defaultValue={this.state.def.contactAddress}/>
                                    <BoxSelect ref="areaCode" className="area-code-wrap"
                                               placeholder="Area Code"
                                               validates={['isSelect']} defaultValue={this.state.def.phone_area_id}
                                               options={this.state.countryList} optValue="id" optLabel="area_code"/>
                                    <Box ref="contactNumber" className="phone-wrap" placeholder="Contact No."
                                         validates={['notNull']} defaultValue={this.state.def.contactNumber}/>
                                </div>

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

                            <div className="list-one-part">
                                <div className="label">Information on directors and all shareholders holding more than 10% shares
                                    <a className="link" href="javascript:" onClick={this.addTr.bind(this)} style={{float: 'right','textDecoration': 'underline'}}>Add</a>
                                </div>
                                <div className="auth-table">
                                    <div className="auth-tr clearfix">
                                        <div className="auth-th cell-first">Name</div>
                                        <div className="auth-th">Residential Address</div>
                                        <div className="auth-th">Place of incorporation</div>
                                        <div className="auth-th">Director/Shareholder</div>
                                        <div className="auth-th">Shareholding (%)</div>
                                    </div>
                                    {this.state.infoList.map((item, i) => {
                                        return (
                                            <div className="auth-tr clearfix" key={i}>
                                                <div className="auth-td cell-first"><input type="text" value={item.name} onChange={this.directorChange.bind(this, 'name', i)}/></div>
                                                <div className="auth-td"><input type="text" value={item.residentialAddress} onChange={this.directorChange.bind(this, 'residentialAddress', i)}/></div>
                                                <div className="auth-td"><input type="text" value={item.incorpration} onChange={this.directorChange.bind(this, 'incorpration', i)}/></div>
                                                <div className="auth-td"><input type="text" value={item.directorShareholder} onChange={this.directorChange.bind(this, 'directorShareholder', i)}/></div>
                                                <div className="auth-td"><input type="text" value={item.shareholding} onChange={this.directorChange.bind(this, 'shareholding', i)}/></div>
                                                {/*<a href="javascript:" className="btn-delete" onClick={this.directorDelete.bind(this, i)}>delete</a>*/}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="list-two-part">
                                <div className="label">Information of the person authorized to give instruction on Customer’s behalf
                                </div>
                                <div className="auth-table">
                                    <div className="auth-tr clearfix">
                                        <div className="auth-th cell-first">Name</div>
                                        <div className="auth-th">Position</div>
                                        <div className="auth-th">Phone/Mobile No.</div>
                                        <div className="auth-th">Passport/I.D. no.</div>
                                    </div>
                                    <div className="auth-tr clearfix">
                                        <div className="auth-td cell-first"><input type="text" value={this.state.authorizedName} onChange={this.inputChange.bind(this, 'authorizedName')}/></div>
                                        <div className="auth-td"><input type="text" value={this.state.position} onChange={this.inputChange.bind(this, 'position')}/></div>
                                        <div className="auth-td"><input type="text" value={this.state.mobile} onChange={this.inputChange.bind(this, 'mobile')}/></div>
                                        <div className="auth-td"><input type="text" value={this.state.passport} onChange={this.inputChange.bind(this, 'passport')}/></div>
                                    </div>
                                </div>
                                <div className="error-line">{this.state.behalfError}</div>
                            </div>

                            <div className="info-part">
                                <div className="label">Type of Corporation</div>
                                <div className="clearfix">
                                    <BoxSelect ref="corporationType" className="auth-box-left"
                                               placeholder="Please select financial institution"
                                               validates={['isSelect']} defaultValue={this.state.def.financial_institution}
                                               onChange={this.institutionChange.bind(this)}
                                               options={this.state.institutionList} optValue="id" optLabel="value"/>
                                    <BoxSelect ref="bank" className="auth-box-right"
                                               placeholder="Please select bank"
                                               validates={['isSelect']} defaultValue={this.state.def.bank}
                                               options={this.state.bankList} optValue="id" optLabel="value"/>
                                </div>
                            </div>

                            <div className="list-one-part">
                                <div className="label">Are there serving or veteran soldiers, government employees and officials among the shareholders who hold more than 25% of the shares? Or the immediate family members of more than one person? If yes, please note:</div>
                                <textarea className="big-box" value={this.state.explainInfo} onChange={this.inputChange.bind(this, 'explainInfo')} name="" id="" cols="30" rows="6" style={{width: '100%',padding: '10px'}} placeholder="Example: 1. (The shareholders themselves meet the above requirements) Shareholder name ,shareholding ratio , position , certificate type , certificate number. &#10;Example: 2. (The immediate relatives of shareholders meet the above requirements) Shareholder name + shareholding ratio + family relationship with shareholders + position + certificate type + certificate number"></textarea>
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
                                        A. For a trust corporation, corporation or partnership, the most recent audited financial statement prepared within 16 months before the relevant date in respect of the trust corporation (or a trust of which it acts as a trustee), corporation or partnership; <br/>
                                        B. For a trust corporation , corporation or partnership, any one or more of the following documents issued or submitted within 12 months before the relevant date—
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
                                    </div>

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

                                <div className="error-line">{this.state.picError}</div>

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

                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Modal>
                </div>
            </Spin>
        );
    }
}

export default Index;