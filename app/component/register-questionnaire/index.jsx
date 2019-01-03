import React from 'react';
import intl from 'react-intl-universal'
import { getPageName, isLogin, isLangZH, jumpUrl } from '@/utils'
import '@/public/css/register-questionnaire.pcss';
import { Radio, Input } from 'antd';

const RadioGroup = Radio.Group;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: '',
            data: [],
            answers: {}
        }
    }

    componentDidMount() {
        const data = [{
            question: 'Q1：Annual income of your family：',
            options: ['≤ 3W HKD', '3—10W HKD', '10—50W HKD', '50—100W HKD', '≥ 100W HKD']
        }, {
            question: 'Q2：Recently, your family expects to invest in securities as a percentage of its total assets (excluding fixed assets such as home ownership and automobiles)：',
            options: ['≥70%', '50%—70%', '30%—50%', '10%—30%', '≤ 10%']
        }]
        const state = {}
        state.data = data
        this.setState(state)
    }

    componentWillUnmount() {
    }

    handleChange(symbol, e) {
        const answers = this.state.answers
        answers[symbol] = e.target.value,
        this.setState({
            answers: answers
        })
    }

    handleNext() {
        var answers = this.state.answers
        if(Object.keys(answers).length < this.state.data.length) {
            this.setState({
                errorMsg: 'Please complete the questionnaire'
            })
        } else {
            this.setState({
                errorMsg: ''
            })
            jumpUrl('auth.html', {
                from: 'question'
            })
        }
    }

    render() {
        return (
            <div className="register-questionnaire">
                <div className="title">Investment Risk Assessment Questionnaire</div>

                {this.state.data.map((item, i) => {
                    return (
                        <div className="question-item" key={'item_' + i}>
                            <div className="question">{item.question}</div>
                            <RadioGroup onChange={this.handleChange.bind(this, 'answer_' + i)} value={this.state.answers['answer_' + i]}>
                                {item.options.map((option, j) => {
                                    return (
                                        <Radio value={j} key={i+'_'+j}>{option}</Radio>
                                    )
                                })}
                            </RadioGroup>
                        </div>
                    )
                })}
                <div className="error-line">{this.state.errorMsg}</div>

                <button className="btn btn-next" onClick={this.handleNext.bind(this)}>Next</button>
            </div>
        );
    }
}

export default Index;