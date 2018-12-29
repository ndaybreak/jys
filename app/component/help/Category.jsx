import React from 'react'
import intl from 'react-intl-universal'
import { getPageName } from '@/utils'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: props.category,
            page: getPageName()
        }
    }
    toDetail(item) {
        if(this.state.page === 'help') {
            window.location.href = 'help-detail.html?categoryId=' + item.id + '&titleId=' + item.info_id
        } else if(this.state.page === 'news') {
            window.location.href = 'news-detail.html?categoryId=' + item.id + '&titleId=' + item.info_id
        }
    }
    render() {
        if(this.state.category.data.length === 0) {
            return ''
        }
        const getMoreLink = (categoryId) => {
            if(this.state.page === 'help') {
                return 'help-more.html?categoryId=' + categoryId
            } else if(this.state.page === 'news') {
                return 'news-more.html?categoryId=' + categoryId
            }
        }
        return (
            <div className="category">
                <div className="title">{this.state.category.value}</div>
                {this.state.category.data.slice(0, 6).map( (item, index) => {
                    return (
                        <div className="item" key={this.state.category.id + '_' + item.info_id}
                            onClick={this.toDetail.bind(this, item)}>{item.title}</div>
                    )
                })}
                {this.state.category.data.length >6 && (
                    <a className="check-more" href={getMoreLink(this.state.category.id)}>{intl.get('more')}</a>
                )}
            </div>
        )
    }
}

export default Header