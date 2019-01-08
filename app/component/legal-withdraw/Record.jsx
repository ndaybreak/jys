import React from 'react';
import intl from 'react-intl-universal'
import {Icon, Modal, Button, Upload, message, Spin} from 'antd'
import {jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH} from '@/utils'
import {setSessionData, getSessionData, removeSessionData} from '@/data'
import previewImg from '@/public/img/放大镜up.png'
import deleteImg from '@/public/img/删除.png'
import videoDemoImg from '@/public/img/register-video-demo.png'
import {getCountryList, saveBasicAuthInfo, savePicAuthInfo, queryAuthInfo, getAuthTypeList, getAuthVideoCode} from '@/api'
import Box from '@/component/common/ui/Box'
import BoxDate from '@/component/common/ui/BoxDate'
import BoxSelect from '@/component/common/ui/BoxSelect'
import { refreshAccountInfo } from '@/utils/auth'

class Record extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dateList: [{
                id: 1,
                value: '1D'
            }, {
                id: 2,
                value: '3D'
            }],
            statusList: [{
                id: 1,
                value: 'Success'
            }, {
                id: 2,
                value: 'Fail'
            }]
        }
    }

    componentDidMount() {
    }

    render() {
        return (
          <div>
              <div className="asset-part record-part">
                  <div className="label">Withdrawal Record</div>
                  <div className="clearfix">
                      <BoxSelect ref="date" className="auth-box-left" placeholder="Date"
                                 options={this.state.dateList} optValue="id" optLabel="value"/>
                      <BoxSelect ref="status" className="auth-box-right" placeholder="Status"
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
                  <div className="record-row">
                      <div className="col-record col-date">2018-12-12 18:15:25</div>
                      <div className="col-record">100</div>
                      <div className="col-record col-fee">10</div>
                      <div className="col-record col-amount">90</div>
                      <div className="col-record">Success</div>
                  </div>
                  <div className="record-row row-odd">
                      <div className="col-record col-date">2018-12-12 18:15:25</div>
                      <div className="col-record">100</div>
                      <div className="col-record col-fee">10</div>
                      <div className="col-record col-amount">90</div>
                      <div className="col-record">Success</div>
                  </div>
                  <div className="record-row">
                      <div className="col-record col-date">2018-12-12 18:15:25</div>
                      <div className="col-record">100</div>
                      <div className="col-record col-fee">10</div>
                      <div className="col-record col-amount">90</div>
                      <div className="col-record">Success</div>
                  </div>
                  <div className="record-row row-odd">
                      <div className="col-record col-date">2018-12-12 18:15:25</div>
                      <div className="col-record">100</div>
                      <div className="col-record col-fee">10</div>
                      <div className="col-record col-amount">90</div>
                      <div className="col-record">Success</div>
                  </div>
              </div>
          </div>
        );
    }
}

export default Record;