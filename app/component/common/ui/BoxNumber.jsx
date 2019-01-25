import React from 'react';
import { validate } from '@/utils'

const getPrecision = (val) => {
    if(String(val).indexOf('.') === -1) {
        return 0
    }
    return (val + '').split('.')[1].length
}

class BoxNumber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: '',
            isValid: true,
            step: props.step || 0.0000001,
            precision: props.precision || (props.step ? getPrecision(props.step) : 8)
        }
        this.state.value = this.formatValue(this.props.value)
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.step !== prevProps.step) {
            this.setState({
                precision: getPrecision(this.props.step)
            })
        }
        if(this.props.value !== prevProps.value) {
            this.setState({
                value: this.formatValue(this.props.value)
            })
        }
    }

    componentWillUnmount() {
    }

    formatValue(val) {
        if(val && !isNaN(val)) {
            return parseFloat(parseFloat(val).toFixed(this.state.precision))
        } else {
            return ''
        }
    }

    boxChange(e) {
        let value = e.target.value
        value = value.substring(0, value.split('.')[0].length + this.state.precision + 1)
        value = value ? Math.abs(parseFloat(value)) : value
        if(value === this.state.value) {
            return
        }

        this.setState({
            value: new Number(value + '')
        }, () => {
            this.props.onChange && this.props.onChange(value ? parseFloat(value) : 0)
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

    setInvalid() {
        this.setState({
            isValid: false
        })
    }

    render() {
        const {placeholder, className, label, unit, step} = this.props
        return (
            <div className={'box-wrap box-number-wrap ' + (className ? className : '')}>
                <span className="label">{label}</span>
                <div className={'box-number'}>
                    <input ref="numberBox" className={'box-number-input ' + (this.state.isValid ? '' : 'box-invalid')} type="number" placeholder={placeholder}
                           value={this.state.value} onChange={this.boxChange.bind(this)} step={step} onBlur={this.onBlur.bind(this)} maxLength={50}/>
                    <span className="box-number-unit">{unit}</span>
                    <div className="box-error">
                        {!this.state.isValid && (
                            <span>{this.state.errorMsg}</span>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default BoxNumber