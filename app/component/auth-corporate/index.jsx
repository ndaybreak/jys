import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin} from 'antd'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH} from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import '@/public/css/auth-corporate.pcss';
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import videoDemoImg from '@/public/img/register-video-demo.png'
import {getCountryList, saveBasicAuthInfo, savePicAuthInfo, queryAuthInfo, getAuthTypeList, getAuthVideoCode} from '@/api'
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
                authType: 1,
                source_funds: 'aa',
                nature_work: 'bb',
                organization_name: 'cc',
                tax_identification_number: 'dd'
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
            videoCode: '',
            infoList: [{}],
            institutionList: [{
                id: 0,
                value: 'Financial Institution'
            }, {
                id: 1,
                value: 'Active NFE'
            }, {
                id: 2,
                value: 'Passive NFE '
            }],
            bankList: [],
            bankData: [[{
                id: 0,
                value: 'Bank'
            }, {
                id: 1,
                value: 'Asset/ Fund Management'
            }, {
                id: 2,
                value: 'Operator Stock Broking '
            }, {
                id: 3,
                value: 'Fund'
            }, {
                id: 4,
                value: 'Insurance Company'
            }, {
                id: 5,
                value: ' Financial Market'
            }, {
                id: 6,
                value: ' Nominees/ Custodian'
            }], [{
                id: 0,
                value: 'Listed on Exchange'
            }, {
                id: 1,
                value: 'Government firm / Agency'
            }, {
                id: 2,
                value: 'Other active NFE'
            }], [{
                id: 0,
                value: 'Financial Institution and located in non-participating jurisdiction'
            }, {
                id: 1,
                value: 'NFE that is not an active NFE'
            }]]
        }
    }

    componentDidMount() {
        this.setState({
            from: getSearchPara('from'),
            bankList: this.state.bankData[0]
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
        const corporationTypeValid = this.refs['corporationType'].validate()
        const bankValid = this.refs['bank'].validate()
        const registerNumberValid = this.refs['registerNumber'].validate()
        // const sssNoValid = this.refs['sssNo'].validate()
        //
        // const picSignValid = !!this.state.picSignImgUrl

        return fullNameValid && birthdayValid && postalCodeValid && birthPlaceValid && presentAddrValid && premanentAddrValid &&
            workNatureValid && companyNameValid && tinValid && fundsSourceValid && nationalityValid && corporationTypeValid && bankValid && registerNumberValid
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
            address: this.refs['presentAddr'].getValue(),
            premanentAddress: this.refs['premanentAddr'].getValue(),
            sourceFunds: this.refs['fundsSource'].getValue(),
            natureWork: this.refs['workNature'].getValue(),
            organizationName: this.refs['companyName'].getValue(),
            taxIdentificationNumber: this.refs['tin'].getValue(),
            // sssGsis: this.refs['sssNo'].getValue(),
            postalCode: this.refs['postalCode'].getValue(),
            countryAreaId: this.refs['nationality'].getValue(),
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
                this.submitPic().then((info) => {
                    ui.tip({
                        // msg: info,
                        msg: 'Register success!',
                        width: 230
                    })
                    this.setState({
                        loading: false
                    })
                    setTimeout(() => {
                        jumpUrl('index.html')
                    }, 3000)
                })
            })
        }
    }

    handleNext() {
        if (this.validateBasicInfo()) {
            this.storeBasicInfo()
            jumpUrl('commitment-letter.html')
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

    addTr() {
        this.setState({
            infoList: this.state.infoList.concat([{}])
        })
    }

    institutionChange(key) {
        this.setState({
            bankList: this.state.bankData[key]
        })
    }

    render() {
        const {picSignImgUrl, picOneImgUrl, picTwoImgUrl, picThreeImgUrl, previewVisible, previewImage, videoUrl} = this.state

        return (
            <Spin spinning={this.state.loading}>
                <div className="auth-page">
                    {this.state.from === 'register' && (
                        <div>
                            <div className="info-part">
                                {/*<div className="tip">{intl.get('auth_1')}</div>*/}
                                <div className="label">Basic Company Information</div>
                                {/*基本信息*/}
                                <div className="clearfix">
                                    <Box ref="fullName" className="auth-box-left" placeholder="Company Name"
                                         validates={['notNull']} defaultValue={this.state.def.full_name}/>
                                    <Box ref="nationality" className="auth-box-right" placeholder="Nature of Busines"
                                         validates={['notNull']} defaultValue={this.state.def.country_area_id}/>
                                </div>
                                <div className="clearfix">
                                    <Box ref="birthPlace" className="auth-box-left" placeholder="Contact Person"
                                         validates={['notNull']} defaultValue={this.state.def.place_birth}/>
                                    <Box ref="presentAddr" className="auth-box-right"
                                         placeholder="Registered Address" validates={['notNull']}
                                         defaultValue={this.state.def.address}/>
                                </div>
                                <div className="clearfix">
                                    <BoxDate ref="birthday" className="auth-box-left"
                                             placeholder="Date of Incorporation" validates={['isSelect']}
                                             defaultValue={this.state.def.birthday}/>
                                    <Box ref="registerNumber" className="auth-box-right"
                                         placeholder="Certificate Incorporation No." validates={['notNull']}
                                         defaultValue=""/>
                                </div>
                                <div className="clearfix">
                                    <Box ref="premanentAddr" className="auth-box-left"
                                         placeholder="Email Address" validates={['notNull']}
                                         defaultValue={this.state.def.premanent_address}/>
                                    <Box ref="postalCode" className="auth-box-right" placeholder="Contact No."
                                         validates={['notNull']} defaultValue={this.state.def.postal_code}/>
                                </div>

                                {/*财务信息*/}
                                <div className="label hide">{intl.get('financeInfo')}</div>
                                <div className="clearfix hide">
                                    <Box ref="fundsSource" className="auth-box-left"
                                         placeholder={intl.get('fundsSource')} validates={['notNull']}
                                         defaultValue={this.state.def.source_funds}/>
                                    <Box ref="workNature" className="auth-box-right"
                                         placeholder={intl.get('workNature')} validates={['notNull']}
                                         defaultValue={this.state.def.nature_work}/>
                                </div>
                                <div className="clearfix hide">
                                    <Box ref="companyName" className="auth-box-left"
                                         placeholder={intl.get('companyName')} validates={['notNull']}
                                         defaultValue={this.state.def.organization_name}/>
                                    <Box ref="tin" className="auth-box-right" placeholder={intl.get('tin')}
                                         validates={['notNull']}
                                         defaultValue={this.state.def.tax_identification_number}/>
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
                                                <div className="auth-td cell-first"><input type="text"/></div>
                                                <div className="auth-td"><input type="text"/></div>
                                                <div className="auth-td"><input type="text"/></div>
                                                <div className="auth-td"><input type="text"/></div>
                                                <div className="auth-td"><input type="text"/></div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="list-two-part">
                                <div className="label">Information of the person(s) authorized to give instruction on Customer's behalf
                                </div>
                                <div className="auth-table">
                                    <div className="auth-tr clearfix">
                                        <div className="auth-th cell-first">Name</div>
                                        <div className="auth-th">Position</div>
                                        <div className="auth-th">Phone/Mobile No.</div>
                                        <div className="auth-th">Passport/I.D. no.</div>
                                    </div>
                                    <div className="auth-tr clearfix">
                                        <div className="auth-td cell-first"><input type="text"/></div>
                                        <div className="auth-td"><input type="text"/></div>
                                        <div className="auth-td"><input type="text"/></div>
                                        <div className="auth-td"><input type="text"/></div>
                                    </div>
                                </div>
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
                                <textarea className="big-box" name="" id="" cols="30" rows="6" style={{width: '100%',padding: '10px'}} placeholder="Example: 1. (The shareholders themselves meet the above requirements) Shareholder name ,shareholding ratio , position , certificate type , certificate number. &#10;Example: 2. (The immediate relatives of shareholders meet the above requirements) Shareholder name + shareholding ratio + family relationship with shareholders + position + certificate type + certificate number"></textarea>
                            </div>

                            <div className="asset-part">
                                {/*Upload Asset Certificate Documents*/}
                                <div className="label">Upload Asset Certificate Documents</div>
                                <div className="tip">In principle, all electronic certification materials require
                                    Chinese or English versions. If they are not in the above two languages, please
                                    provide the official version issued by the formal translation company with personal
                                    signature or seal.
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
                                    <button className="btn btn-next" onClick={this.handleNext.bind(this)}>Next</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/*证件照*/}
                    {this.state.from === 'question' && (
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