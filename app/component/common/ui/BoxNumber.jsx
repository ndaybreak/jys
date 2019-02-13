import React from 'react';
import { validate, isNumber, getPrecision, truncateByPrecision } from '@/utils'

const formatValue = (val, precision) => {
    if(isNumber(val)) {
        // return parseFloat(parseFloat(val).toFixed(precision))
        return truncateByPrecision(val, precision, true)
    } else {
        return ''
    }
}

class BoxNumber extends React.Component {
    constructor(props) {
        super(props)
        if(typeof props.precision !== 'undefined') {
            this.precision = props.precision
        } else if(props.step) {
            this.precision = getPrecision(props.step)
        } else {
            this.precision = 8
        }

        this.state = {
            errorMsg: '',
            isValid: true,
            value: formatValue(props.value, this.precision)
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.step !== prevProps.step && typeof this.props.precision === 'undefined') {
            this.precision = getPrecision(this.props.step)
        }
        if(this.props.precision !== prevProps.precision) {
            this.precision = this.props.precision
        }
        if(this.props.value !== prevProps.value) {
            this.setState({
                value: formatValue(this.props.value, this.precision)
            })
        }
    }

    componentWillUnmount() {
    }

    boxChange(e) {
        let value = formatValue(e.target.value, this.precision)
        value = isNumber(value) ? Math.abs(value) : value
        // if(value === this.state.value) {
        //     return
        // }

        this.setState({
            // value: new Number(value + '')
            value: value
        }, () => {
            // this.props.onChange && this.props.onChange(isNumber(value) ? parseFloat(value) : 0)
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

    setInvalid() {
        this.setState({
            isValid: false
        })
    }

    render() {
        const {placeholder, className, label, unit, step} = this.props
        return (
            <div className={'box-wrap box-number-wrap ' + (className ? className : '')}>
                <span className={'label ' + (label ? '' : 'hide')}>{label}</span>
                <div className={'box-number'}>
                    <input ref="numberBox" className={'box-number-input ' + (this.state.isValid ? '' : 'box-invalid')} type="number" placeholder={placeholder}
                           value={this.state.value} onChange={this.boxChange.bind(this)} step={step || 0.00000001} onBlur={this.onBlur.bind(this)} maxLength={50}/>
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