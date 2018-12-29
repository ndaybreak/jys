import React from 'react';
import { DatePicker } from 'antd'
import { validate } from '@/utils'
import moment from "moment/moment";

const dateFormat = 'YYYY-MM-DD'

class BoxDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            value: props.value
        }
    }

    componentDidMount() {
    }

    mouseEnter() {
        this.setState({
            show: true
        })
    }
    mouseLeave() {
        this.setState({
            show: false
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.value !== prevProps.value) {
            this.setState({
                value: this.props.value
            })
        }
        if(this.props.data !== prevProps.data) {
            this.setState({
                data: this.props.data
            })
        }
    }

    componentWillUnmount() {
    }

    selectChange(value) {
        this.setState({
            value: value,
            show: false
        })
        this.props.onChange && this.props.onChange(value)
    }

    render() {
        const { data=[] } = this.props

        const getDisplay = () => {
            for(let i = 0, len = data.length; i < len; i++) {
                if(data[i].value == this.state.value) {
                    return data[i].label
                }
            }
            return ''
        }

        return (
            <div className="select-wrap" onMouseEnter={this.mouseEnter.bind(this)} onMouseLeave={this.mouseLeave.bind(this)}>
                <span className="selected">{getDisplay()}<i className={'icon icon-arrow-down ' + (this.state.show ? 'rotate' : '')}></i></span>
                {this.state.show && (
                    <div className="select-list">
                        {data.map( (item, index) => {
                            return (
                                <div className="select-item" onClick={this.selectChange.bind(this, item.value)} key={index}>{item.label}</div>
                            )
                        })}
                    </div>
                )}
            </div>
        );
    }
}

export default BoxDate