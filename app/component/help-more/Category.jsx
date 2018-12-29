import React from 'react'
import '@/public/css/help-more.pcss'
import { getPageName } from '@/utils'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        if(this.props.category.data.length === 0) {
            return ''
        }
        return (
            <div className="category">
                {this.props.category.data.map( (item, index) => {
                    return (
                        <div className="item ellipsis" key={'category_' + item.info_id}
                             onClick={this.toDetail.bind(this, item)}>{item.title}</div>
                    )
                })}
            </div>
        )
    }
}

export default Header