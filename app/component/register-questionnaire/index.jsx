import React from 'react';
import intl from 'react-intl-universal'
import { getPageName, isLogin, isLangZH, jumpUrl, ui } from '@/utils'
import {setToken, getUser, refreshAccountInfo} from '@/utils/auth'
import { getQuestions, answerQuestions } from '@/api'
import '@/public/css/register-questionnaire.pcss';
import { Radio, Input, Checkbox, Spin } from 'antd';

const RadioGroup = Radio.Group;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            errorMsg: '',
            partOneData: [],
            partTwoData: [],
            singleAnswers: {},
            multipleAnswers: {},
            staticSingleAnswers: {},
            staticMultipleAnswers: {}
        }
    }

    componentDidMount() {
        this.loadData()
        // const data = {
        //     "part":[
        //         {
        //             "questions":[
        //                 {
        //                     "id": 2,
        //                     "multiple": false,
        //                     "title": {"lang0": "全年收入 (港幣)","lang1": "Annual Income (HKD)"},
        //                     "option": [
        //                         {"lang0": "少於 $500,000","lang1": "Below $500,000","score": 10},
        //                         {"lang0": "介乎 $500,000 - $1,000,000","lang1": "Between $500,000 - $1,000,000","score": 10},
        //                         {"lang0": "介乎 $1,000,000 - $3,000,000","lang1": "Between $1,000,000 - $3,000,000","score": 10},
        //                         {"lang0": "介乎 $3,000,000 - $5,000,000","lang1": "Between $3,000,000 - $5,000,000","score": 10},
        //                         {"lang0": "介乎 $5,000,000 - $8,000,000","lang1": "Between $5,000,000 - $8,000,000","score": 10},
        //                         {"lang0": "多於 $8,000,000","lang1": "Above $8,000,000","score": 10}
        //                     ]
        //                 },
        //                 {
        //                     "id": 3,
        //                     "multiple": true,
        //                     "title": {"lang0": "流動資產 (港幣)","lang1": "Liquid Assets (HKD)"},
        //                     "option": [
        //                         {"lang0": "少於 $500,000","lang1": "Below $500,000","score": 10},
        //                         {"lang0": "介乎 $500,000 - $1,000,000","lang1": "Between $500,000 - $1,000,000","score": 10},
        //                         {"lang0": "介乎 $1,000,000 - $3,000,000","lang1": "Between $1,000,000 - $3,000,000","score": 10},
        //                         {"lang0": "介乎 $3,000,000 - $5,000,000","lang1": "Between $3,000,000 - $5,000,000","score": 10},
        //                         {"lang0": "介乎 $5,000,000 - $8,000,000","lang1": "Between $5,000,000 - $8,000,000","score": 10},
        //                         {"lang0": "多於 $8,000,000","lang1": "Above $8,000,000","score": 10}
        //                     ]
        //                 }
        //             ]
        //         },
        //         {
        //             "questions":
        //                 [
        //                     {
        //                         "id": 1,
        //                         "multiple": false,
        //                         "title": {"lang0": "什么是私钥？","lang1": "What is a Private Key in crypto currency?"},
        //                         "option": [
        //                             {"lang0": "一种可以修改的密码","lang1": "A modifiable password","score": 10},
        //                             {"lang0": "注册交易平台账号时填写的密码","lang1": "The password you filled in when registering your account in a trading platform","score": 10},
        //                             {"lang0": "用来管理自己区块链上信息和资产的唯一钥匙","lang1": "The only key to managing information and assets on your block chain","score": 10},
        //                             {"lang0": "一把可以随身携带的钥匙","lang1": "A key you can carry with you","score": 10}
        //                         ]
        //                     },
        //                     {
        //                         "id": 2,
        //                         "multiple": true,
        //                         "title": {"lang0": "您参与过哪些区块链相关的事？","lang1": "What have you been involved in about block chains您参与过哪些区块链相关的事？"},
        //                         "option": [
        //                             {"lang0": "只是听说过","lang1": "Just heard of it","score": 10},
        //                             {"lang0": "对概念有一些了解","lang1": "Some understanding of concepts","score": 10},
        //                             {"lang0": "数字货币投资","lang1": "Crypto currency Investment","score": 10},
        //                             {"lang0": "区块链工作者","lang1": "Block Chain Workers","score": 10}
        //                         ]
        //                     }
        //                 ]
        //         }
        //
        //     ]
        // }
        // const data = [{
        //     question: 'Q1：Annual income of your family：',
        //     options: ['≤ 3W HKD', '3—10W HKD', '10—50W HKD', '50—100W HKD', '≥ 100W HKD']
        // }, {
        //     question: 'Q2：Recently, your family expects to invest in securities as a percentage of its total assets (excluding fixed assets such as home ownership and automobiles)：',
        //     options: ['≥70%', '50%—70%', '30%—50%', '10%—30%', '≤ 10%']
        // }]
        // const state = {}
        // state.data = data
        // this.setState({
        //     partOneData: data.part[0].questions,
        //     partTwoData: data.part[1].questions
        // })
    }

    loadData() {
        this.setState({
            loading: true
        })
        getQuestions().then(res => {
            this.setState({
                loading: false,
                partOneData: res.data.part[0].questions,
                partTwoData: res.data.part[1].questions
            })
        })
    }

    componentWillUnmount() {
    }

    handleSingleChange(key, e) {
        const answers = this.state.singleAnswers
        answers[key] = e.target.value
        this.setState({
            singleAnswers: answers
        })
    }

    handleMultipleChange(key, e) {
        const answers = this.state.multipleAnswers
        answers[key] = e.target.checked
        this.setState({
            multipleAnswers: answers
        })
    }

    staticRadioChange(key, e) {
        const radioAnswers = this.state.staticSingleAnswers
        radioAnswers[key] = e.target.value
        const checkboxAnswers = this.state.staticMultipleAnswers
        checkboxAnswers[key] = true
        this.setState({
            staticSingleAnswers: radioAnswers,
            staticMultipleAnswers: checkboxAnswers
        })
    }
    staticCheckboxChange(key, e) {
        const radioAnswers = this.state.staticSingleAnswers
        if(e.target.checked) {
            radioAnswers[key] = key + '-0'
        } else {
            radioAnswers[key] = undefined
        }

        const checkboxAnswers = this.state.staticMultipleAnswers
        checkboxAnswers[key] = e.target.checked
        this.setState({
            staticSingleAnswers: radioAnswers,
            staticMultipleAnswers: checkboxAnswers
        })
    }

    validate() {
        const singleCount = Object.keys(this.state.singleAnswers).length
        const idObj = {}
        const multipleAnswers = this.state.multipleAnswers
        for(let key in multipleAnswers) {
            if(multipleAnswers[key]) {
                idObj[key.split('-')[1]] = 1
            }
        }
        const total = singleCount + Object.keys(idObj).length
        const orignalTotal = this.state.partOneData.length + this.state.partTwoData.length
        const staticMultipleAnswers = this.state.staticMultipleAnswers
        const isStaticSelected = Object.keys(staticMultipleAnswers).some(item => {
            return staticMultipleAnswers[item]
        })
        // const checkboxAnswers = this.state.staticMultipleAnswers
        if((total < orignalTotal) || !isStaticSelected) {
            this.setState({
                errorMsg: 'Please complete the questionnaire'
            })
            return false
        } else {
            this.setState({
                errorMsg: ''
            })
            return true
        }
    }

    getValue() {
        const result = []
        const singleAnswers = this.state.singleAnswers
        for(let key in singleAnswers) {
            const list = singleAnswers[key].split('-')
            result.push({
                part: list[0],
                id: list[1],
                option: list[2]
            })
        }
        const multipleAnswers = this.state.multipleAnswers
        for(let mAnswer in multipleAnswers) {
            if(multipleAnswers[mAnswer]) {
                const list = mAnswer.split('-')
                result.push({
                    part: list[0],
                    id: list[1],
                    option: list[2]
                })
            }
        }
        console.log(result)
        return result
    }

    handleSubmit() {
        if(this.validate()) {
            const answers = this.getValue()
            answerQuestions(answers).then(res => {
                refreshAccountInfo().then(res => {
                    ui.tip({
                        msg: 'Congratulations on passing the investment test. You can already trade on the platform. ',
                        width: 300,
                        callback: () => {
                            jumpUrl('deal.html')
                        }
                    })
                })
            }, error => {
                if(error.code === '2') {
                    ui.confirm({
                        msg: 'According to the results of the questionnaire you filled in, you are not satisfied with the investment requirements. \n' +
                        'Would you like to retest it? ',
                        okText: 'Retest',
                        cancelText: 'No',
                        onOk: () => {
                            // window.location.reload()
                            this.setState({
                                singleAnswers: {},
                                multipleAnswers: {}
                            })
                        }
                    })
                } else {
                    ui.tip({
                        msg: error.info
                    })
                }
            })
        }
    }

    render() {
        return (
            <Spin spinning={this.state.loading}>
                <div className="register-questionnaire">
                    <div className="title">Investment Risk Assessment Questionnaire</div>
                    <div className="question-part">Part 1 :Investment Knowledge Assessment</div>

                    <div className="question-item static-item">
                        {/*0-0-0-0 part-id-answer1-answer2*/}
                        <div className="question">1. Investment Experience</div>
                        <div>
                            <Checkbox className="static-checkbox" checked={this.state.staticMultipleAnswers['0-1-0']} onChange={this.staticCheckboxChange.bind(this, '0-1-0')}>Equities</Checkbox>
                            <RadioGroup onChange={this.staticRadioChange.bind(this, '0-1-0')} value={this.state.staticSingleAnswers['0-1-0']}>
                                <Radio value="0-1-0-0">&lt;2 years</Radio>
                                <Radio value="0-1-0-1">2 – 10 years</Radio>
                                <Radio value="0-1-0-2">&gt;10 years</Radio>
                            </RadioGroup>
                        </div>
                        <div>
                            <Checkbox className="static-checkbox" checked={this.state.staticMultipleAnswers['0-1-1']} onChange={this.staticCheckboxChange.bind(this, '0-1-1')}>Futures / Options</Checkbox>
                            <RadioGroup onChange={this.staticRadioChange.bind(this, '0-1-1')} value={this.state.staticSingleAnswers['0-1-1']}>
                                <Radio value="0-1-1-0">&lt;2 years</Radio>
                                <Radio value="0-1-1-1">2 – 10 years</Radio>
                                <Radio value="0-1-1-2">&gt;10 years</Radio>
                            </RadioGroup>
                        </div>
                        <div>
                            <Checkbox className="static-checkbox" checked={this.state.staticMultipleAnswers['0-1-2']} onChange={this.staticCheckboxChange.bind(this, '0-1-2')}>Forex / Bullion</Checkbox>
                            <RadioGroup onChange={this.staticRadioChange.bind(this, '0-1-2')} value={this.state.staticSingleAnswers['0-1-2']}>
                                <Radio value="0-1-2-0">&lt;2 years</Radio>
                                <Radio value="0-1-2-1">2 – 10 years</Radio>
                                <Radio value="0-1-2-2">&gt;10 years</Radio>
                            </RadioGroup>
                        </div>
                        <div>
                            <Checkbox className="static-checkbox" checked={this.state.staticMultipleAnswers['0-1-3']} onChange={this.staticCheckboxChange.bind(this, '0-1-3')}>Funds</Checkbox>
                            <RadioGroup onChange={this.staticRadioChange.bind(this, '0-1-3')} value={this.state.staticSingleAnswers['0-1-3']}>
                                <Radio value="0-1-3-0">&lt;2 years</Radio>
                                <Radio value="0-1-3-1">2 – 10 years</Radio>
                                <Radio value="0-1-3-2">&gt;10 years</Radio>
                            </RadioGroup>
                        </div>
                        <div>
                            <Checkbox className="static-checkbox" checked={this.state.staticMultipleAnswers['0-1-4']} onChange={this.staticCheckboxChange.bind(this, '0-1-4')}>Bonds</Checkbox>
                            <RadioGroup onChange={this.staticRadioChange.bind(this, '0-1-4')} value={this.state.staticSingleAnswers['0-1-4']}>
                                <Radio value="0-1-4-0">&lt;2 years</Radio>
                                <Radio value="0-1-4-1">2 – 10 years</Radio>
                                <Radio value="0-1-4-2">&gt;10 years</Radio>
                            </RadioGroup>
                        </div>
                        <div>
                            <Checkbox className="static-checkbox" checked={this.state.staticMultipleAnswers['0-1-5']} onChange={this.staticCheckboxChange.bind(this, '0-1-5')}>Nil.</Checkbox>
                        </div>
                    </div>

                    {this.state.partOneData.map((item, i) => {
                        return (
                            <div className="question-item" key={'item_' + i}>
                                <div className="question">{(i + 2) + '. ' + item.title.lang1}</div>
                                {!item.multiple && (
                                    <RadioGroup className="question-radio-group" onChange={this.handleSingleChange.bind(this, 'part1_answer_' + i)} value={this.state.singleAnswers['part1_answer_' + i]}>
                                        {item.option.map((option, j) => {
                                            return (
                                                <Radio value={'0-' + item.id + '-' + j} key={i+'_'+j}>{option.lang1}</Radio>
                                            )
                                        })}
                                    </RadioGroup>
                                )}
                                {item.multiple && item.option.map((option, j) => {
                                    return (
                                        <Checkbox className="question-checkbox" checked={this.state.multipleAnswers['0-' + item.id+ '-' + j]} onChange={this.handleMultipleChange.bind(this, '0-' + item.id+ '-' + j)} key={i+'_'+j}>{option.lang1}</Checkbox>
                                    )
                                })}
                            </div>
                        )
                    })}

                    <div className="question-part" style={{marginTop: '70px'}}>Part 2 :Knowledge Assessment For Crypto Currency</div>
                    {this.state.partTwoData.map((item, i) => {
                        return (
                            <div className="question-item" key={'item_' + i}>
                                <div className="question">{(i + 1) + '. ' + item.title.lang1}</div>
                                {!item.multiple && (
                                    <RadioGroup className="question-radio-group" onChange={this.handleSingleChange.bind(this, 'part2_answer_' + i)} value={this.state.singleAnswers['part2_answer_' + i]}>
                                        {item.option.map((option, j) => {
                                            return (
                                                <Radio value={'1-' + item.id + '-' + j} key={i+'_'+j}>{option.lang1}</Radio>
                                            )
                                        })}
                                    </RadioGroup>
                                )}
                                {item.multiple && item.option.map((option, j) => {
                                    return (
                                        <Checkbox className="question-checkbox" checked={this.state.multipleAnswers['1-' + item.id+ '-' + j]} onChange={this.handleMultipleChange.bind(this, '1-' + item.id+ '-' + j)} key={i+'_'+j}>{option.lang1}</Checkbox>
                                    )
                                })}
                            </div>
                        )
                    })}

                    <div className="error-line">{this.state.errorMsg}</div>

                    <button className="btn btn-next" onClick={this.handleSubmit.bind(this)}>Submit</button>
                </div>
            </Spin>
        );
    }
}

export default Index;