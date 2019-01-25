import React from 'react';
import intl from 'react-intl-universal'
import { Modal, Button } from 'antd';
import ReactCodeInput from 'react-code-input'
import { jumpUrl, validate, getSearchPara, ui, kebabCaseData2Camel, isLangZH, isLogin } from '@/utils'
import { setSessionData, getSessionData, removeSessionData } from '@/data'
import { getEntrustmentList, entrustmentTrade } from '@/api'
import BoxNumber from '@/component/common/ui/BoxNumber'
// import { getTargetPairsQuot } from '@/api/quot'
import eventProxy from '@/utils/eventProxy'

const DATA = {
    'BTC': {
        title: 'BITCOIN',
        brief: '<h2>WHAT IS BITCOIN?</h2>' +
        '<p>Bitcoin is a digital currency; its creation and transfer is based on an open source protocol encryption network that is totally independent from any central authority. A Bitcoin can be transferred by a computer or a smartphone without the use of any intervening third party or intermediate financial institution. The concept was introduced in 2008 on a white paper published by a pseudonymous programmer named Satoshi Nakamoto, in what was defined as a peer-to-peer electronic payment system. The Network was turned on by Satoshi on the 3rd of January 2009.</p>' +
        '<p>Bitcoin can be used for payments similarly to the dollar (or other currency). Due to the mathematical characteristics of Bitcoin, it has an immense potential due to its multi-divisible properties enabling micro values to be sent with virtually no cost. Bitcoin opens the door to many possibilities and services that have not been imagined.</p>',
        content: '<h2>WHAT IS BITCOIN?</h2>' +
        '<p>Bitcoin is a digital currency; its creation and transfer is based on an open source protocol encryption network that is totally independent from any central authority. A Bitcoin can be transferred by a computer or a smartphone without the use of any intervening third party or intermediate financial institution. The concept was introduced in 2008 on a white paper published by a pseudonymous programmer named Satoshi Nakamoto, in what was defined as a peer-to-peer electronic payment system. The Network was turned on by Satoshi on the 3rd of January 2009.</p>' +
        '<p>Bitcoin can be used for payments similarly to the dollar (or other currency). Due to the mathematical characteristics of Bitcoin, it has an immense potential due to its multi-divisible properties enabling micro values to be sent with virtually no cost. Bitcoin opens the door to many possibilities and services that have not been imagined.</p>' +
        '<p>Bitcoin is an efficient solution when it comes to tipping or making donations over the internet. Donations can be visible to the general public enabling a better financial solution and greater transparency for non-profit organizations. Also in Emergency situations such as natural catastrophes, donations in Bitcoin arrive faster to those in need thus reducing the international response time as well as being extremely effective as a frictionless way of value transfer.Though there are still very few initiatives, we can already see the first crowdfunding projects related to Bitcoin pop up more frequently.</p>' +
        '<p>Bitcoin allows pseudonymous transactions and transfer of property and other values. Bitcoins can be stored on a computer inside special software that stores the encrypted keys, or on an online wallet provided by third parties; in both cases Bitcoins can be sent over the Internet to anyone who has a Bitcoin address.</p>' +
        '<p>The p2p topology of the Bitcoin network and the absence of a central management entity make it impossible for any authority, government or institution, to control the distribution and issuance of Bitcoin.</p>' +
        '<h2>How are Bitcoins created?</h2>' +
        '<p>For the creation of this new virtual currency an open source program connects the peers along a network built specifically for this purpose. Unlike most currencies, Bitcoin is not dependent on trust in any centralized issuer; instead it is ruled by an encrypted complex mathematic algorithm which is the main building block of  the protocol. Bitcoin uses a distributed database spread across nodes of this peer-to-peer network to record transactions, and uses encryption to provide basic security functions, such as ensuring ownership, and avoiding double spending.</p>' +
        '<p>Basically, all bitcoin transactions are recorded on a giant ledger shared by all the network users. When someone uses bitcoin to pay for something or get paid, the executed transaction is recorded on this public ledger. The machines running the bitcoin protocol algorithm then compete to confirm the transaction by solving complex mathematical equations, and once a block is processed the machines running it are rewarded for their effort. This process is widely known as Mining.</p>' +
        '<h2>Mining Bitcoin</h2>' +
        '<p>When the network was launched by Satoshi in 2009, any computer connected to the network could effectively mine bitcoins. This was possible because there were too few people mining it and because the protocol made it to be that way. Bitcoin operates as a peer-to-peer network. This means that everyone connected to the network is helping to produce it. With paper money, governments decide when money is printed and how it will be distributed, but bitcoin is completely decentralized, it doesn’t have any central government. Bitcoin is mined using special software to solve math problems. Miners run the software on their machines and are issued a certain amount of bitcoin in return. This provides a smart way to issue the currency and also creates an incentive for more people to participate. As more people participate in mining the more secure the network becomes. The Bitcoin Network automatically adjusts the difficulty of the math problems depending on how fast they are being solved. In the early days, bitcoin miners solved these difficult problems with regular desktops and laptops but soon new hardware for mining was introduced and the difficulty became harder and harder for regular desktops to keep up with mining.</p>' +
        '<p>“Bitcoin is completely decentralized it doesn’t have any central government.”\n' +
        'Bitcoin miners are rewarded by a new batch of Bitcoins about 6 times per hour which are distributed among miners according to their utilized computing power or “hash rate”. Everyone has the opportunity to win their share while running the Bitcoin miner software program, or third party programs. The act of creating Bitcoins is usually entitled rmining because it has some similarities with gold mining. The probability of a certain user to gain a lot depends on the processing power that he contributes to the network in relation to the processing power of all the miners combined. The amount of Bitcoins generated by batch never exceeds 50, and this value is programmed to shrink every four years until it gets to 0, so that the total set amount of Bitcoins to ever be produced will never exceed 21 million.</p>' +
        '<p>All miners on the network compete for the first to find a solution to a cryptographic problem involving their candidate block, a problem that requires repeated trial and error to solve. When a node finds the solution, he announces to the other nodes in the network and claims a new batch of Bitcoins. Instead of individual mining, miners can also join in groups known as “pools” and collectively mine getting back faster payouts divided by chunks.</p>'
    },
    'ETH': {
        title: 'Ether',
        brief: '<h2>What is Ether?</h2>' +
        '<p>Ether is a necessary element — a fuel — for operating the distributed application platform Ethereum. It is a form of payment made by the clients of the platform to the machines executing the requested operations. To put it another way, ether is the incentive ensuring that developers write quality applications (wasteful code costs more), and that the network remains healthy (people are compensated for their contributed resources).（From https://www.ethereum.org） </p>',
        content: '<h2>What is Ether?</h2>' +
        '<p>Ether is a necessary element — a fuel — for operating the distributed application platform Ethereum. It is a form of payment made by the clients of the platform to the machines executing the requested operations. To put it another way, ether is the incentive ensuring that developers write quality applications (wasteful code costs more), and that the network remains healthy (people are compensated for their contributed resources).（From https://www.ethereum.org） </p>'
    }
}


class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            company: {}
        }
    }

    componentDidMount() {
        eventProxy.on('coinsUpdate', (data) => {
            const company = DATA[data.base]
            if(company) {
                this.setState({
                    company: company
                })
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
    }

    showMore() {
        this.setState({
            visible: true
        })
    }
    handleClose() {
        this.setState({
            visible: false
        })
    }

    render() {
        return (
            <div className="company-info-wrap">
                <div className="clearfix">
                    <span className="company-name">{this.state.company.title}</span>
                    <a className="module-more" href="javascript:" onClick={this.showMore.bind(this)}>more</a>
                </div>
                <div className="company-info" dangerouslySetInnerHTML={{__html: this.state.company.brief}}></div>

                <Modal
                    className="modal-confirm-davao modal-big"
                    visible={this.state.visible}
                    width={870}
                    style={{top: 100}}
                    onCancel={this.handleClose.bind(this)}
                    footer=''
                >
                    <div className="davao-confirm-wrap">
                        <div className="title">{this.state.company.title}</div>
                        <div className="content" dangerouslySetInnerHTML={{__html: this.state.company.content}}></div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default User;