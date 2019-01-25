import React from 'react';
import { validate } from '@/utils'

class Box extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue || '',
            errorMsg: '',
            isValid: true,
            maxLength: props.maxLength || 50
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.defaultValue !== prevProps.defaultValue) {
            this.setState({
                value: this.props.defaultValue
            })
        }
    }

    componentWillUnmount() {
    }

    boxChange(e) {
        const value = e.target.value
        this.setState({
            value: value
        }, () => {
            this.props.onChange && this.props.onChange(value)

            if(!this.props.disableTimelyValidate) {
                this.validate()
            }
        })
    }

    onBlur() {
        if(!this.props.disableTimelyValidate) {
            this.validate()
        }
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
        const {placeholder, className, defaultValue, type} = this.props
        return (
            <div className={'box-wrap ' + className}>
                <input className={'box ' + (this.state.isValid ? '' : 'box-invalid')} type={type ? type : 'text'} placeholder={placeholder}
                       value={this.state.value || ''} onChange={this.boxChange.bind(this)} onBlur={this.onBlur.bind(this)} maxLength={this.state.maxLength}/>
                <div className="box-error">
                    {!this.state.isValid && (
                        <span>{this.state.errorMsg}</span>
                    )}
                </div>
            </div>
        );
    }
}

export default Box