import React from 'react';
import intl from 'react-intl-universal'
import { getMarketCoinQuot, getTargetPairsQuot } from '@/api/quot'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, deepClone } from '@/utils'
import checkedImg from '@/public/img/选中.png'
import unCheckedImg from '@/public/img/未选中.png'

const getData = (map) => {
    const list = []
    for(let attr in map) {
        if(map.hasOwnProperty(attr)) {
            list.push(map[attr])
        }
    }
    const result = list.sort((a, b) => {
        return a.index - b.index
    })
    return result
}

const resetData = (data, index, isChecked) => {
    data[index].isSelected = isChecked
    if(data[index].isSubChart && isChecked) {
        data.forEach((item, i) => {
            if(item.isSubChart && i !== index) {
                item.isSelected = false
            }
        })
    }
    return data
}

const getDataMap = (data) => {
    const map = {}
    data.forEach((item) => {
        map[item.key] = item
    })
    return map
}

class CoinList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: getData(props.map),
            isChecked: false
        }

    }

    componentDidMount() {

    }

    handleCheckBoxChange(index, e) {
        let data = deepClone(this.state.data)
        const newData = resetData(data, index, e.target.checked)
        this.setState({
            data: newData
        })
        this.props.resetIndicator(getDataMap(newData))
    }

    render() {
        return (
            <div className="coin-list-inner">
                {this.state.data.map((item, i) => {
                    return (
                        <div className="item" key={i}>
                            <span className="indicator-name">{item.name}</span>
                            <label className="indicator-select">
                                <input type="checkbox" className="hide" checked={item.isSelected} onChange={this.handleCheckBoxChange.bind(this, i)}/>
                                {item.isSelected && (
                                    <img src={checkedImg} alt=""/>
                                )}
                                {!item.isSelected && (
                                    <img src={unCheckedImg} alt=""/>
                                )}
                            </label>
                        </div>
                    )
                })}
            </div>
        );
    }
}


export default CoinList;
