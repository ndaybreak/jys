import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin, Pagination} from 'antd'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, parseTime} from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import videoDemoImg from '@/public/img/register-video-demo.png'
import {getLegalWithdrawRecord} from '@/api'
import Box from '@/component/common/ui/Box'
import BoxDate from '@/component/common/ui/BoxDate'
import BoxSelect from '@/component/common/ui/BoxSelect'
import { refreshAccountInfo } from '@/utils/auth'

function getStatus(status) {
    if(status == 0) {
        return 'to audit'
    } else if(status == 1) {
        return 'rejected'
    } else if(status == 2) {
        return 'passed'
    }
}

class Record extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            total: 0,
            currPage: 1,
            data: [],
            dateList: [{
                id: '',
                value: 'All'
            }, {
                id: 1,
                value: '1D'
            }, {
                id: 3,
                value: '3D'
            }, {
                id: 7,
                value: '1W'
            }, {
                id: 30,
                value: '1M'
            }],
            statusList: [{
                id: '',
                value: 'All'
            }, {
                id: 0,
                value: 'to audit'
            }, {
                id: 1,
                value: 'rejected'
            }, {
                id: 2,
                value: 'passed'
            }]
        }
    }

    componentDidMount() {
        this.loadData(1)
    }
    assetFilter() {
        setTimeout(() => {
            this.loadData(1)
        })
    }

    loadData(page) {
        this.setState({
            currPage: page,
            loading: true
        })
        const para = {
            currPage: page,
            pageSize: 10,
            day: this.refs.date.getValue(),
            status: this.refs.status.getValue()
        }
        getLegalWithdrawRecord(para).then(res => {
            console.log(res.data)
            this.setState({
                data: res.data,
                loading: false,
                total: res.pageInfo.totalCount
            })
        })
    }

    render() {
        return (
          <div>
              <div className="asset-part record-part">
                  <div className="part-label">Withdrawal Record</div>
                  <div className="clearfix">
                      <BoxSelect ref="date" className="auth-box-left" placeholder="Date"
                                 onChange={this.assetFilter.bind(this)}
                                 options={this.state.dateList} optValue="id" optLabel="value"/>
                      <BoxSelect ref="status" className="auth-box-right" placeholder="Status"
                                 onChange={this.assetFilter.bind(this)}
                                 options={this.state.statusList} optValue="id" optLabel="value"/>
                  </div>
              </div>
              <div className="withdraw-list">
                  <div className="recode-title clearfix">
                      <div className="col-record col-date">Date</div>
                      <div className="col-record">Order number</div>
                      <div className="col-record col-fee">Fees</div>
                      <div className="col-record col-amount">Arrival amount</div>
                      <div className="col-record">Status</div>
                  </div>
                  {this.state.data.map((item,i) => {
                      return (
                          <div className={'record-row ' + (i%2 === 1 ? 'row-odd' : '')} key={i}>
                              <div className="col-record col-date">{parseTime(item.create_time)}</div>
                              <div className="col-record">{item.order_number}</div>
                              <div className="col-record col-fee">{item.service_fee}</div>
                              <div className="col-record col-amount">{item.actual_quantity}</div>
                              <div className="col-record">{getStatus(item.status)}</div>
                          </div>
                      )
                  })}

                  <Pagination className="detail-pagination"
                              total={this.state.total}
                              current={this.state.currPage}
                              onChange={this.loadData.bind(this)} />
              </div>
          </div>
        );
    }
}

export default Record;