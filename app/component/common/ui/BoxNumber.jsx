import React from 'react';
import { validate } from '@/utils'

const getPrecision = (val) => {
    let decimals =(val + '').split('.')[1]
    return decimals ?  decimals.length : 0
}

class Box extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: '',
            isValid: true,
            step: props.step || 0.0000001,
            precision: props.step ? getPrecision(props.step) : 8
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
        if(value == this.state.value) {
            return
        }

        this.setState({
            value: value
        }, () => {
            this.props.onChange && this.props.onChange(value ? parseFloat(value) : 0)
        })
    }

    getValue() {
        return this.state.value
    }

    validate() {
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
            <div className={'box-number-wrap ' + (className ? className : '')}>
                <span className="label">{label}</span>
                <div className={'box-number'}>
                    <input className={'box-number-input ' + (this.state.isValid ? '' : 'box-invalid')} type="number" placeholder={placeholder}
                           value={this.state.value} onChange={this.boxChange.bind(this)} step={step}/>
                    <span className="box-number-unit">{unit}</span>
                </div>
            </div>
        );
    }
}

export default Box