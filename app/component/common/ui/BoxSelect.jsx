import React from 'react';
import { Select } from 'antd'
import { validate } from '@/utils'

class BoxSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue || undefined,
            errorMsg: '',
            isValid: true
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

    boxChange(id) {
        const value = id
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
    setValue(val) {
        this.setState({
            value: val
        })
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
        const {placeholder, className, optValue, optLabel, defaultValue} = this.props
        const options = this.props.options || []
        return (
            <div className={'box-wrap box-select-wrap ' + className + (this.state.isValid ? '' : ' box-invalid')}>
                {typeof defaultValue !== 'undefined' && (
                    <Select
                        className="box-select"
                        showSearch
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        optionFilterProp="children"
                        value={this.state.value}
                        onChange={this.boxChange.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                        filterOption={(input, option) => (option.props.children + '').toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {options.map((item, index) => {
                            return <Select.Option value={item[optValue]} key={index}>{item[optLabel]}</Select.Option>
                        })}
                    </Select>
                )}
                {typeof defaultValue === 'undefined' && (
                    <Select
                        className="box-select"
                        showSearch
                        placeholder={placeholder}
                        optionFilterProp="children"
                        value={this.state.value}
                        onChange={this.boxChange.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                        filterOption={(input, option) => (option.props.children + '').toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        {options.map((item, index) => {
                            return <Select.Option value={item[optValue]} key={index}>{item[optLabel]}</Select.Option>
                        })}
                    </Select>
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

export default BoxSelect