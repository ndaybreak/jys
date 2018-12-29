import React from 'react';
import intl from 'react-intl-universal'
import '@/public/css/news-more.pcss';
import { getCategorys } from '@/api'
import HelpHeader from '@/component/help/HelpHeader'
import Category from '@/component/help-more/Category'
import Breadcrumb from '@/component/common/Breadcrumb'
import Pagination from '@/component/common/Pagination'
import { getSessionData } from '@/data'
import { getSearchPara } from '@/utils'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultSearchVal: '',
            leftData: {},
            rightData: {},
            title: '',
            breadcrumbData: [],
            data: [],
            pageOfItems: []
        }
    }

    componentDidMount() {
        const categoryMap = getSessionData('categoryMap')
        const list = categoryMap[getSearchPara('categoryId')]
        this.setState({
            title: list[0].catalog,
            breadcrumbData: [{
                path: 'news.html',
                val: intl.get('news')
            }, {
                val: list[0].catalog
            }],
            data: list
        })
    }

    componentWillUnmount() {
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({
            leftData: {data: pageOfItems.slice(0, 12)},
            rightData: {data: pageOfItems.slice(12, pageOfItems.length)},
        })
    }

    search(val) {
        window.location.href = 'news-search.html?search=' + encodeURIComponent(val)
    }

    render() {
        return (
            <div className="help-home-page">
                <HelpHeader title={intl.get('news')} search={this.search.bind(this)} defaultValue={this.state.defaultSearchVal}></HelpHeader>
                <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                <div className="help-content clearfix">
                    {this.state.title && (
                        <div className="category" style={{display: 'block'}}>
                            <div className="title" style={{lineHeight: '80px'}}>{this.state.title}</div>
                        </div>
                    )}
                    {this.state.leftData.data && this.state.leftData.data.length > 0 && (
                        <Category category={this.state.leftData}></Category>
                    )}
                    {this.state.rightData.data && this.state.rightData.data.length > 0 && (
                        <Category category={this.state.rightData}></Category>
                    )}
                    {this.state.title && (
                        <div className="txt-center">
                            <Pagination items={this.state.data} onChangePage={this.onChangePage.bind(this)} pageSize={24} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Index;