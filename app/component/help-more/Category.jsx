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
    // onClick={this.toDetail.bind(this, item)}
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
        const getDetailLink = (item) => {
            if(this.state.page === 'help') {
                return 'help-detail.html?categoryId=' + item.id + '&titleId=' + item.info_id
            } else if(this.state.page === 'news') {
                return 'news-detail.html?categoryId=' + item.id + '&titleId=' + item.info_id
            }
        }
        return (
            <div className="category">
                {this.props.category.data.map( (item, index) => {
                    return (
                        <div className="item ellipsis" key={'category_' + item.info_id}>
                            <a className="link" href={getDetailLink(item)}>{item.title}</a>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Header