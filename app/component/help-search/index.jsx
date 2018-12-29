import React from 'react';
import intl from 'react-intl-universal'
import '@/public/css/help-search.pcss';
import {getHelpSearch} from '@/api'
import HelpHeader from '@/component/help/HelpHeader'
import Breadcrumb from '@/component/common/Breadcrumb'
import PaginationServer from '@/component/common/PaginationServer'
import {getSessionData} from '@/data'
import {getSearchPara} from '@/utils'

class Index extends React.Component {
    constructor(props) {
        super(props);
        const searchVal = getSearchPara('search')
        this.state = {
            defaultSearchVal: searchVal || '',
            leftData: {},
            rightData: {},
            title: '',
            breadcrumbData: [{
                path: 'help.html',
                val: intl.get('support')
            }, {
                val: intl.get('searchResult')
            }],
            data: [],
            pageOfItems: [],
            searchVal: searchVal,
            totalCount: 0,
            currPage: 1
        }
    }


    componentDidMount() {
        this.getData(this.state.searchVal, 1)
    }

    onChangePage(page) {
        this.getData(this.state.searchVal, page)
    }

    search(val) {
        this.getData(val, 1)
    }

    getData(val, page) {
        val = (val + '').trim()
        if(!val) {
            return
        }
        getHelpSearch(val, page).then(res => {
            this.setState({
                data: res.data,
                totalCount: res.pageInfo.totalCount,
                searchVal: val,
                currPage: page
            })
        })
    }

    render() {
        const getDetailLink = (item) => {
            return 'help-detail.html?categoryId=' + item.catalog_id + '&titleId=' + item.info_id
        }
        const getCategoryLink = (item) => {
            return [{
                path: 'help.html',
                val: intl.get('support')
            }, {
                path: 'help-more.html?categoryId=' + item.catalog_id,
                val: item.catalog
            }]
        }
        const getContent = (content) => {
            var reg = new RegExp(this.state.searchVal, "gim")
            return content.replace(reg, '<strong>' + this.state.searchVal + '</strong>')
        }
        return (
            <div className="help-home-page">
                <HelpHeader title={intl.get('support')} search={this.search.bind(this)} defaultValue={this.state.defaultSearchVal}></HelpHeader>
                <Breadcrumb data={this.state.breadcrumbData}></Breadcrumb>
                <div className="help-content clearfix">
                    <div className="title">{intl.get('searchResult')}</div>
                    <div style={{color: '#666666', paddingBottom: '10px'}}><span className="search-label">"{this.state.searchVal}"</span>{intl.get('ofSearchResult')}：<span
                    className="search-label">{this.state.totalCount}</span>{intl.get('items')}
                    </div>
                    {this.state.data.map((item, index) => {
                        return (
                            <div className="search-item-wrap" key={'detail_' + index}>
                                <div className="title-link"><a href={getDetailLink(item)}>{item.title}</a></div>
                                <Breadcrumb data={getCategoryLink(item)}></Breadcrumb>
                                <div className="item-content" dangerouslySetInnerHTML={{__html: getContent(item.content)}}></div>
                            </div>
                        )
                    })}
                    <div className="txt-center">
                        <PaginationServer total={this.state.totalCount} initialPage={this.state.currPage} onChangePage={this.onChangePage.bind(this)}
                                    pageSize={5}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;