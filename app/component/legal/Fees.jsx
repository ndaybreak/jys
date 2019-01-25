import React from 'react';
import '@/public/css/fees.pcss';
import {Table} from "antd";

class Fees extends React.Component {
    render() {
        const tab = [
            {
                name: 'Deposit Fee',
                tab: {
                    columns: [
                        {title: 'Assets', key: 'name', dataIndex: 'name', width: 300},
                        {title: 'Minimum Account', key: 'account', dataIndex: 'account', width: 300},
                        {title: 'Fee', key: 'fee', dataIndex: 'fee', width: 300}
                    ],
                    data: [
                        {key: '1', name: 'BTC', account: 'Unlimited', fee: 'Free'},
                        {key: '2', name: 'ETH', account: 'Unlimited', fee: 'Free'},
                        {key: '3', name: 'HKD', account: 'Unlimited', fee: 'Free (Excluding Bank Fees)'}
                    ]
                }
            },
            {
                name: 'Withdrawal Fee',
                tab: {
                    columns: [
                        {title: 'Assets', key: 'name', dataIndex: 'name', width: 180},
                        {title: 'Minimum Amount Per Each Time', key: 'minAmtTime', dataIndex: 'minAmtTime', width: 180},
                        {title: 'Maximum Amount Per Each Time', key: 'maxAmtTime', dataIndex: 'maxAmtTime', width: 180},
                        {title: 'Fee', key: 'fee', dataIndex: 'fee', width: 180},
                        {title: 'Maximum Amount Per day', key: 'maxAmtDay', dataIndex: 'maxAmtDay', width: 180,
                            render: (text, row, index) => {
                                return {
                                    children: text,
                                    props: {
                                        rowSpan: index > 1 ? 1 : (index === 0 ? 2 : 0),
                                    }
                                };
                            }
                        }
                    ],
                    data: [
                        {key: '1', name: 'BTC', minAmtTime: '0.01 BTC', maxAmtTime: '20 BTC', fee: '0.0005 BTC', maxAmtDay: 'The total withdrawal value of all virtual currencies does not exceed 40BTC'},
                        {key: '2', name: 'ETH',minAmtTime: '0.2 ETH', maxAmtTime: '800 ETH', fee: '0.01 ETH', },
                        {key: '3', name: 'HKD', minAmtTime: '100 HKD', maxAmtTime: '100,000 HKD', fee: '1‰ (Excluding Bank Fees)',  maxAmtDay: '100,000 HKD'}
                    ]
                }
            },
            {
                name: 'Trade',
                tab: {
                    columns: [
                        {title: 'Maker', key: 'maker', dataIndex: 'maker', width: 450},
                        {title: 'Trader', key: 'trader', dataIndex: 'trader', width: 450}
                    ],
                    data: [
                        {key: '1',maker: '1‰',trader: '1‰' }
                    ]
                }
            }
        ].map((tabVal) => {
                return (<div key={tabVal.name}>
                        <div className={'tab-name'}>{tabVal.name}</div>
                        <Table className={'table'} dataSource={tabVal.tab.data} bordered={true} columns={tabVal.tab.columns}
                               pagination={false}/>
                    </div>
                )
            }
        );
        return (<div className={'fees-page'}>
                <div className={'page-title'}>{"Fees"}</div>
                <div className={'time'}>{'2019-01'}</div>
                {tab}
            </div>
        );
    }
}

export default Fees;