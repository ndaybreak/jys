import React from 'react';
import { DatePicker } from 'antd'
import { validate } from '@/utils'
import moment from "moment/moment";

const dateFormat = 'YYYY-MM-DD'

class BoxDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultValue: props.defaultValue || '',
            value: props.defaultValue || '',
            errorMsg: '',
            isValid: true
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.defaultValue !== prevProps.defaultValue) {
            this.setState({
                value: this.props.defaultValue,
                defaultValue: this.props.defaultValue
            })
        }
    }

    componentWillUnmount() {
    }

    boxChange(moment, value) {
        this.setState({
            value: value
        }, () => {
            this.props.onChange && this.props.onChange(value)
            this.validate()
        })
    }

    onBlur() {
        this.validate()
    }

    getValue() {
        return this.state.value
    }

    validate() {
        if(!Array.isArray(this.props.validates)) {
            return true
        }
        const result = validate({
            value: this.state.value,
            validates: this.props.validates
        })
        this.setState({
            isValid: result.pass,
            errorMsg: result.msg
        })
        return result.pass
    }

    render() {
        const {placeholder, className} = this.props
        return (
            <div className={'box-wrap box-time-wrap ' + className}>
                {this.state.defaultValue && (
                    <DatePicker className={'box-time ' + (this.state.isValid ? '' : 'box-invalid')} placeholder={placeholder}
                                defaultValue={moment(this.state.value, dateFormat)}
                                onBlur={this.onBlur.bind(this)}
                                format={dateFormat} onChange={this.boxChange.bind(this)} />
                )}
                {!this.state.defaultValue && (
                    <DatePicker className={'box-time ' + (this.state.isValid ? '' : 'box-invalid')} placeholder={placeholder}
                                onBlur={this.onBlur.bind(this)}
                                format={dateFormat} onChange={this.boxChange.bind(this)}/>
                )}
                <div className="box-error">
                    {!this.state.isValid && (
                        <span>{this.state.errorMsg}</span>
                    )}
                </div>
            </div>
        );
    }
}

export default BoxDate