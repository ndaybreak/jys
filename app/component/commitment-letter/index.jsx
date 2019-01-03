import React from 'react';
import intl from 'react-intl-universal'
import { getPageName, isLogin, isLangZH, jumpUrl } from '@/utils'
import '@/public/css/commitment-letter.pcss';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    agree() {
        jumpUrl('register-questionnaire.html')
    }

    render() {
        return (
            <div className="commitment-letter">
                <div className="title">User Commitment Letter</div>
                {/*<div>Name: San Chi Nan</div>*/}
                {/*<div>ID or Passport Number: C668668(E)</div>*/}
                {/*<div>Address: No. 100, Tim Qi Road, Admiralty, Hong Kong</div>*/}
                <p>
                    I/We confirm that the information given by Hong Kong Security Token Limited is true, correct and complete, and authorize Hong Kong Security Token Limited to confirm and verify this from any source Hong Kong Security Token Limited consider appropriate, including the conduct of any credit checks on me/us. Hong Kong Security Token Limited is entitled to rely fully on such information and representations for all purposes, unless Hong Kong Security Token Limited receive notice in writing of any change.
                </p>
                <p>
                    I/We confirm that I/we will update Hong Kong Security Token Limited immediately on any changes. I/We confirm that I am/ we are acting for my/ our own account and as principal in relation to each transaction entered with Hong Kong Security Token Limited and I/ we shall also be the beneficiary of any of the transaction entered into with Hong Kong Security Token Limited.
                </p>
                <p>
                    I/We hereby certify, declare and acknowledge that I/we have fully understood the risk disclosure statements in the language of my/our choice (English or Chinese). I/We was/ were invited to read the risk disclosure statements, and to ask questions and take independent advice if I/We so wished.
                </p>
                <p>
                    I/We have read the (Information to Account Holders pursuant to the Personal Data (Privacy) Ordinance (Cap.486), understood and agree to them.
                </p>
                <p>
                    I/We understand that the account is subject to final acceptance of Hong Kong Security Token Limited as the case may be.
                </p>

                <button className="btn btn-agree" onClick={this.agree.bind(this)}>I Agree</button>
            </div>
        );
    }
}

export default Index;