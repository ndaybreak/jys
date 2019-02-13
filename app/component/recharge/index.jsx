import React from 'react';
import intl from 'react-intl-universal'
var QRCode = require('qrcode-react')
import Breadcrumb from '@/component/common/Breadcrumb'
import RechargeSelect from '@/component/recharge/RechargeSelect'
import { Icon, Modal, Button, Select, Upload } from 'antd'
import BoxNumber from '@/component/common/ui/BoxNumber'
import { jumpUrl, validate, ui, getSearchPara } from '@/utils'
import { vcRecharge } from '@/api'
import '@/public/css/recharge.pcss';
import codeImgDefault from '@/public/img/二维码占位符.png'
import logoImg from '@/public/img/code_logo.png'
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import { getRechargeAddress } from '@/api'
import {message} from "antd/lib/index";

const uploadUrl = process.env.BASE_API + '/file/public/uploadImg?'
const isSubmit = !!getSearchPara('address')
// const isSubmit = true

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
            breadcrumbData: [{
                path: 'user.html',
                val: intl.get('personalCenter')
            }, {
                val: intl.get('deposit')
            }],
            selected: {
                coin_code: getSearchPara('code'),
                id: getSearchPara('id')
            },
            previewVisible: false,
            previewImage: '',
            picSignHover: false,
            picSignError: '',
            picSignImgUrl: '',
            picOneHover: false,
            picOneError: '',
            picOneImgUrl: ''
            // picOneImgUrl: ''
        }
    }

    componentWillMount() {

    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }

    handleCoinChange(item) {
        getRechargeAddress(item.id).then(res => {
            this.setState({
                address: res.data.address
            })
        }, error => {
            ui.tip({
                width: 300,
                msg: error.info
            })
        })
    }

    handleNext() {
        if(this.state.address) {
            jumpUrl('recharge.html', {
                id: getSearchPara('id'),
                code: getSearchPara('code'),
                address: this.state.address
            })
        }
    }
    validate() {
        const amountValid = this.refs['amount'].validate()
        const picValid = !!this.state.picOneImgUrl

        if(picValid) {
            this.setState({
                picOneError: ''
            })
        } else {
            this.setState({
                picOneError: 'Please upload picture'
            })
        }

        return amountValid && picValid
    }
    handleSubmit() {
        if(this.validate()) {
            const para = {
                coinId: getSearchPara('id'),
                address: getSearchPara('address'),
                quantity: this.refs.amount.getValue(),
                certificate: this.state.picOneImgUrl,
            }
            vcRecharge(para).then(res => {
                ui.tip({
                    msg: intl.get('successTip'),
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

    handleChange(imgUrl, info) {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            const state = {loading: false, picOneError: ''}
            state[imgUrl] = info.file.response.data.fileUrl
            this.setState(state)
        }
    }

    render() {
        return (
            <div className="recharge-withdraw-page" style={{marginTop: (isSubmit ? '20px' : '0px')}}>
                {!isSubmit && (
                    <div className="header">
                        <span className="title">{intl.get('deposit')}</span>
                        <RechargeSelect onChange={this.handleCoinChange.bind(this)} selected={this.state.selected} isRecharge={true}/>
                    </div>
                )}
                <div className="content">
                    <div className="content-inner">
                        <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                        {!isSubmit && (
                            <div>
                                <div className="module-name">{intl.get('rechargeAddress')}</div>
                                <div className="code">
                                    {this.state.address}
                                    {!this.state.address && (
                                        <div className="address-empty">--</div>
                                    )}
                                </div>
                                <div className="code-label">{intl.get('rechargeRqCode')}</div>
                                {!this.state.address && (
                                    <img className="code-img" src={codeImgDefault} alt=""/>
                                )}
                                {this.state.address && (
                                    <div className="code-img">
                                        <QRCode value={this.state.address} size={160} logo={logoImg} logoWidth={30}/>
                                    </div>
                                )}
                                <button className={'btn btn-next ' + (this.state.address ? '' : 'btn-disabled')} onClick={this.handleNext.bind(this)}>Next</button>
                            </div>
                        )}
                        {isSubmit && (
                            <div>
                                <div className="module-name">Submit remittance record</div>
                                <div className="clearfix">
                                    <BoxNumber ref="amount" className="amount-box" placeholder="Deposit amount" validates={['notNull']}/>
                                </div>
                                <div className="pic-tip">
                                    The remittance voucher must display a clear bank name, account holder's name, account number and amount. Please upload colorful, clear jpeg, png, jpg files up to 5MB in size.
                                </div>

                                <div className="pic-item pic-one">
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
                                            {this.state.picOneImgUrl ? <img className="pic-value" src={this.state.picOneImgUrl}/> :
                                                <span></span>}
                                            <div
                                                className={'pic-tool ' + (this.state.picOneHover ? 'hover' : '')}>{intl.get('clickToUpload')}</div>
                                        </Upload>
                                        {this.state.picOneImgUrl && (
                                            <span className={'preview-btn ' + (this.state.picOneHover ? 'hover' : '')}
                                                  onClick={this.handlePreview.bind(this, this.state.picOneImgUrl)}>
                                        <img src={previewImg} title={intl.get('clickToPreview')}/>
                                    </span>
                                        )}
                                    </div>
                                    <div className="error-line">{this.state.picOneError}</div>
                                </div>

                                <button className={'btn btn-next btn-submit'} onClick={this.handleSubmit.bind(this)}>Submit</button>
                            </div>
                        )}

                    </div>
                </div>

                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel.bind(this)}>
                    <img style={{width: '100%'}} src={this.state.previewImage}/>
                </Modal>
            </div>
        );
    }
}

export default Index;