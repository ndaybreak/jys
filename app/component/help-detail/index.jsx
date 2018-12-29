import React from 'react';
import intl from 'react-intl-universal'
import '@/public/css/help-detail.pcss';
import { getHelpDetail } from '@/api'
import HelpHeader from '@/component/help/HelpHeader'
import Category from '@/component/help/Category'
import Breadcrumb from '@/component/common/Breadcrumb'
import { getSessionData } from '@/data'
import { getSearchPara } from '@/utils'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultSearchVal: '',
            title: '',
            breadcrumbData: [],
            pageOfItems: [],
            category: {},
            content: ''
        }
    }

    componentDidMount() {
        const categoryMap = getSessionData('categoryMap')
        const categoryId = getSearchPara('categoryId')
        const list = categoryMap[categoryId]
        this.setState({
            breadcrumbData: [{
                path: 'help.html',
                val: intl.get('support')
            }, {
                val: list[0].catalog
            }],
            category: {
                id: categoryId,
                value: list[0].catalog,
                data: list
            }
        })
        this.getDetail()
    }

    componentWillUnmount() {
    }

    getDetail() {
        getHelpDetail(getSearchPara('titleId')).then(res => {
            this.setState({
                title: res.data[0].title,
                content: res.data[0].content
            })
        })
    }

    search(val) {
        window.location.href = 'help-search.html?search=' + encodeURIComponent(val)
    }

    render() {
        return (
            <div className="help-home-page">
                <HelpHeader title={intl.get('support')} search={this.search.bind(this)} defaultValue={this.state.defaultSearchVal}></HelpHeader>
                <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                <div className="help-content clearfix">
                    <div className="left">
                        {this.state.category.data && this.state.category.data.length > 0 && (
                            <Category category={this.state.category}></Category>
                        )}
                    </div>
                    <div className="right-content">
                        {this.state.title && (
                            <div className="category" style={{display: 'block'}}>
                                <div className="title" style={{lineHeight: '70px'}}>{this.state.title}</div>
                            </div>
                        )}
                        <div className="content" dangerouslySetInnerHTML={{__html: this.state.content}}>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;