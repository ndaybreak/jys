import React from 'react'
import intl from 'react-intl-universal'
import '@/public/css/helpHeader.pcss'
import { getPageName } from '@/utils'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.defaultValue,
            page: getPageName()
        }
    }
    handleChange(e) {
        this.setState({
            value: e.target.value
        })
    }
    handleSearch() {
        this.props.search && this.props.search(this.state.value)
    }
    keyUp(e) {
        if(e.keyCode === 13) {
            this.handleSearch()
        }
    }
    render() {
        const getTitle = () => {
            if(this.state.page === 'help') {
                return intl.get('support')
            } else if(this.state.page === 'news') {
                return intl.get('news')
            }
        }
        return (
            <div className="help-header">
                <div className="content">
                    <span className="title">{getTitle()}</span>
                    <div className="help-search-wrap">
                        <span className="icon-search"></span>
                        <input className="input-search" type="text" placeholder={intl.get('enterTip')} onKeyUp={this.keyUp.bind(this)} value={this.state.value} onChange={this.handleChange.bind(this)} />
                        <button className="btn-help-search" onClick={this.handleSearch.bind(this)}>{intl.get('searchNews')}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header