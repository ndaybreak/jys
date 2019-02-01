import React from 'react';
import intl from 'react-intl-universal'
import { getPageName, isLogin, isLangZH, jumpUrl, getSearchPara } from '@/utils'
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
        // jumpUrl('register-questionnaire.html')
        if(getSearchPara('from') === 'person') {
            jumpUrl('auth.html', {
                isSubmit: 'Y'
            })
        } else {
            jumpUrl('auth-corporate.html', {
                isSubmit: 'Y'
            })
        }
    }

    render() {
        return (
            <div className="commitment-letter">
                <div className="title">User's Commitments</div>
                {/*<div>Name: San Chi Nan</div>*/}
                {/*<div>ID or Passport Number: C668668(E)</div>*/}
                {/*<div>Address: No. 100, Tim Qi Road, Admiralty, Hong Kong</div>*/}
                <p>
                    I/We confirm that all information and representations I/We provide to HKSTOx Limited (the <b>“HKSTOx”</b>) are true, correct and complete; and authorize HKSTOx to confirm and verify the information from any source HKSTOx considers appropriate, including but not limited to the conduct of any credit checks on me/us. HKSTOx is entitled to rely fully on such information and representations for all purposes, unless HKSTOx receives notice in writing of any change(s) from me/us. I/We confirm that I/we will notify HKSTOx immediately on any such changes of information and representations.
                </p>
                <p>
                    I/We confirm that I am/we are acting for my/our own account as a principal in relation to each transaction entered into with HKSTOx and I/we shall also be the beneficiary of any of the transaction entered into with HKSTOx.
                </p>
                <p>
                    I/We hereby certify, declare and acknowledge that I/we have fully understood the risk disclosure statements in the language of my/our choice (English or Chinese).  I/We was/were invited to read the risk disclosure statements, and to ask questions and gain independent advice if I/we so desired.
                </p>
                <p>
                    I/We have read the (Information to Account Holders pursuant to the Personal Data (Privacy) Ordinance (Cap.486), understood and agree to them.
                </p>
                <p>
                    I/We understand that the account is subject to final approval of HKSTOx as the case may be.
                </p>

                <button className="btn btn-agree" onClick={this.agree.bind(this)}>I Agree</button>
            </div>
        );
    }
}

export default Index;