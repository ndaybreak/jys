import React from 'react';
import '@/public/css/fees.pcss';

class Fees extends React.Component {

    createTabRow(cols) {
        const rowCell = cols ? cols.map((cellVal) => {
            return <div className={'tab-cell-wrap'}> <span className={'table-cell'}>
                    {cellVal}</span></div>
        }) : "";
        return (<div className={'tab-row'}>{rowCell}</div>)
    }

    createTable(tab) {
        const tabColNames = tab.header ? (tab.header.map((headerName) => {
            return <div className={'tab-column-header-wrap'}>
                <span className={'tab-header-cell'}>
                    {headerName}</span></div>
        })) : "";
        return (<div className={'table'}>
            <div className={'tab-row'}>
                {tabColNames}
            </div>
            {tab.rows ? (tab.rows.map((cols) => {
                return this.createTabRow(cols)
            })) : ""}
        </div>)
    }

    render() {
        const tab = [{
            name: 'Deposit Fee',
            tab: {
                header: ['Assets', 'Minimum Account', 'Fee'],
                rows: [['BTC', '0.01 BTC', 'Free'],
                    ['ETH', '0.01 ETH', 'Free'],
                    ['HKD', 'Unlimited', 'Free (Excluding Bank Fees)'],]
            }
        },
            {
                name: 'Withdrawal Fee',
                tab: {
                    header: ['Assets', 'Minimum Amount Per Each Time', 'Maximum Amount Per Each Time', 'Maximum Amount Per day', 'Fee', 'Maximum times of withdrawal per day'],
                    rows: [
                        ['BTC', '0.01 BTC', '20 BTC', '20 BTC', '0.0005 BTC', '10'],
                        ['ETH', '0.2 ETH', '800 ETH', '800 ETH', '0.01 ETH', '10'],
                        ['HKD', '100 HKD', '100,000 HKD', '100,000 HKD', '1‰(Excluding Bank Fees)', '1'],
                    ]
                }
            },
            {
                name: 'Trade',
                tab: {
                    header: ['Maker', 'Taker'],
                    rows: [['1‰', '1‰']]
                }
            }].map((tabVal) => {
                return (<div key={tabVal.name}>
                        <div className={'tab-name'}>{tabVal.name}</div>
                        {this.createTable(tabVal.tab)}
                    </div>
                )
            }
        );
        return (<div className={'fees-page'}>
                <div className={'page-title'}>{"Fees"}</div>
                <div className={'time'}>{'2019-01-18 18:18'}</div>
                {tab}
            </div>
        );
    }
}

export default Fees;