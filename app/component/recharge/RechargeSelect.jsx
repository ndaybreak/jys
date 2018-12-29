import React from 'react';
import intl from 'react-intl-universal'
import { Icon, Modal, Button } from 'antd'
import { jumpUrl, validate } from '@/utils'
import userImg from '@/public/img/用户名.png'
import { getCoinList } from '@/api'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            assetList: [],
            show: false
        }
    }

    componentWillMount() {

    }
    componentDidMount() {
        document.body.addEventListener('click', (e) => {
            if(!e.target.classList.contains('select-area')) {
                this.setState({
                    show: false
                })
            }
        })
        getCoinList({isRecharge: true}).then(res => {
            this.setState({
                assetList: res.data
            })
        })
    }

    componentWillUnmount() {
    }

    handleShow() {
        this.setState({
            show: true
        })
    }

    select(item) {
        this.setState({
            selected: item,
            show: false
        })
        if(!(this.state.selected && this.state.selected.coin_code === item.coin_code)) {
            this.props.onChange && this.props.onChange(item)
        }
    }

    toggleShow() {
        this.setState({
            show: !this.state.show
        })
    }

    render() {
        const { selected, show, assetList } = this.state
        return (
            <div className="recharge-select-wrap">
                <div className="selected-wrap clearfix">
                    <div className="selected" onClick={this.handleShow.bind(this)}>
                        {selected && (
                            <div className="item">
                                {/*<img src={selected.icon} alt=""/>*/}
                                {selected.coin_code}
                                {/*<span className="full-name">({selected.coin_name})</span>*/}
                            </div>
                        )}
                        {!selected && (
                            <div className="empty">{intl.get('coinSelect')}</div>
                        )}
                    </div>
                    <span className={'click-area select-area' + (show ? ' active' : '')} onClick={this.toggleShow.bind(this)}><i className={'icon icon-arrow-down select-area' + (show ? ' rotate' : '')}></i></span>
                </div>
                <div className="list-wrap">
                    {show && assetList.map(asset => {
                        return (
                            <div className="item select-area" key={asset.id} onClick={this.select.bind(this, asset)}>
                                {/*<img className="select-area" src={asset.icon} alt=""/>*/}
                                {asset.coin_code}
                                {/*<span className="full-name select-area">({asset.coin_name})</span>*/}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default Index;