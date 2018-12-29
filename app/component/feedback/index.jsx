import React from 'react';
import intl from 'react-intl-universal'
import { Icon, Modal, Button, Upload, message, Spin } from 'antd'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH } from '@/utils'
import { setSessionData, getSessionData, removeSessionData } from '@/data'
import '@/public/css/feedback.pcss';
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import { getCountryList, saveBasicAuthInfo, saveFeedback, queryAuthInfo } from '@/api'
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
                authType: 1,
            },
            questionTypeList: [{
                id: 1,
                name: intl.get('questionType1')
            }, {
                id: 2,
                name: intl.get('questionType2')
            }, {
                id: 3,
                name: intl.get('questionType3')
            }, {
                id: 4,
                name: intl.get('questionType4')
            }, {
                id: 5,
                name: intl.get('questionType5')
            }, {
                id: 6,
                name: intl.get('questionType6')
            }, {
                id: 7,
                name: intl.get('questionType7')
            }, {
                id: 8,
                name: intl.get('questionType8')
            }],
            previewVisible: false,
            previewImage: '',
            picList: [],
            description: ''
        }
    }

    componentDidMount() {
    }

    handleChange(info) {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            const state = {loading: false, picList: this.state.picList}
            state.picList.push(info.file.response.data.fileUrl)
            this.setState(state)
        }
    }

    validateAll() {
        const authTypeValid = this.refs['questionType'].validate()

        // const picOneValid = !!this.state.picOneImgUrl
        // const picTwoValid = !!this.state.picTwoImgUrl
        // const picThreeValid = !!this.state.picThreeImgUrl
        // this.setState({
        //     picOneError: picOneValid ? '' : intl.get('uploadPhotoTip'),
        //     picTwoError: picTwoValid ? '' : intl.get('uploadPhotoTip'),
        //     picThreeError: picThreeValid ? '' : intl.get('uploadPhotoTip')
        // })

        return authTypeValid
    }

    submit() {
        if(this.validateAll()) {
            this.setState({
                loading: true
            })
            const para = {
                feedbackInfo: this.state.description,
                phone: this.refs['phone'].getValue(),
                type: this.refs['questionType'].getValue()
            }
            const attrs = ['pictureOne', 'pictureTwo', 'pictureThree']
            this.state.picList.forEach((url, i) => {
                para[attrs[i]] = url
            })
            saveFeedback(para).then(res => {
                ui.tip({
                    msg: intl.get('submitted')
                })
                this.setState({
                    loading: false
                })
                setTimeout(() => {
                    // jumpUrl('index.html')
                    window.location.reload()
                }, 2000)
            }, error => {
                this.setState({
                    loading: false
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
    handlePreview(i) {
        this.setState({
            previewImage: this.state.picList[i],
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

    descriptionChange(e) {
        this.setState({
            description: e.target.value.substr(0, 500)
        })
    }

    render() {
        const { picOneImgUrl, picTwoImgUrl, picThreeImgUrl, previewVisible, previewImage } = this.state

        return (
            <Spin spinning={this.state.loading}>
                <div className="auth-page">
                    <div className="pic-part">
                        <div className="auth-type-wrap">
                            <div className="clearfix">
                                <BoxSelect ref="questionType" className="auth-box-left" placeholder={intl.get('feedback_1')}
                                           validates={['isSelect']}
                                           options={this.state.questionTypeList} optValue="id" optLabel="name"/>
                                <Box ref="phone" className="auth-box-right" placeholder={intl.get('feedback_2')}/>
                            </div>
                            <textarea className="description" name="" id="" cols="30" rows="8" placeholder={intl.get('feedback_3')}
                                value={this.state.description} onChange={this.descriptionChange.bind(this)}></textarea>
                            <span className="description-count">{this.state.description.length}/500</span>
                        </div>

                        <div className="clearfix upload-wrap">
                            <div className="upload-title">{intl.get('feedback_4')}</div>
                            <div className="pic-list">
                                {this.state.picList.map((pic, i) => {
                                    return (
                                        <div className="pic-item" key={i}>
                                            <div className="pic-wrap">
                                                <img className="pic-value" src={pic} />
                                            </div>
                                            <span className="preview-btn" onClick={this.handlePreview.bind(this, i)}>
                                                <img src={previewImg} title={intl.get('clickToPreview')}/>
                                            </span>
                                            <span className="preview-btn btn-delete" onClick={this.handleDelete.bind(this, i)}>
                                                <img src={deleteImg} title={intl.get('delete')}/>
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="pic-item">
                                <div className={'pic ' + (this.state.picList.length > 2 ? 'pic-max' : '')} title={this.state.picList.length > 2 ? intl.get('feedback_5') : ''}>
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className={'pic-uploader ' + (this.state.picList.length > 2 ? 'hide' : '')}
                                        showUploadList={false}
                                        action={uploadUrl + 'type=4'}
                                        beforeUpload={beforeUpload}
                                        onChange={this.handleChange.bind(this)}
                                    >
                                        <span></span>
                                    </Upload>
                                </div>
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