import React from 'react';
import '@/public/css/help.pcss';
import { getCategorys } from '@/api'
import HelpHeader from '@/component/help/HelpHeader'
import Category from '@/component/help/Category'
import { setSessionData } from '@/data'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultSearchVal: '',
            categoryList: []
        }
    }

    formatData(data) {
        var categoryMap = {}
        data.forEach(item => {
            if(categoryMap[item.id]) {
                categoryMap[item.id].push(item)
            } else {
                categoryMap[item.id] = [item]
            }
        })
        setSessionData('categoryMap', JSON.stringify(categoryMap))
        return Object.keys(categoryMap).map(id => {
            return {
                id: id,
                value: categoryMap[id][0].catalog,
                data: categoryMap[id]
            }
        })
    }

    componentDidMount() {
        getCategorys().then(res => {
            this.setState({
                categoryList: this.formatData(res.data)
            })
        })
    }

    componentWillUnmount() {
    }

    search(val) {
        window.location.href = 'help-search.html?search=' + encodeURIComponent(val)
    }

    render() {
        return (
            <div className="help-home-page">
                <HelpHeader search={this.search.bind(this)} defaultValue={this.state.defaultSearchVal}></HelpHeader>
                <div className="help-content clearfix">
                    {this.state.categoryList.map( (category, index) => {
                        return <Category category={category} key={'category_' + index}></Category>
                    })}
                </div>
            </div>
        );
    }
}

export default Index;