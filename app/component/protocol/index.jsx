import React from 'react';
import intl from 'react-intl-universal'
import { getPageName, isLogin, isLangZH, jumpUrl } from '@/utils'
import '@/public/css/protocol.pcss';

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
            <div className="protocol-page">
                <div className="title">Registration Agreement</div>
                <div className="label">Eligibility</div>
                <p>
                    By registering to use a STOX Account, you have affirmed that you are at least 18 years old and are an individual, legal person or other organization with full legal capacity to enter into this User Agreement between you and Binance. If you are not, you and your guardian shall undertake all consequences resulting from your actions and Binance shall have the right to cancel or freeze your account in addition to filing claims against you and your guardian for compensation.
                </p>

                <div className="label">
                    Description of services
                </div>
                <p>
                    STOX strives to maintain the accuracy of information posted on its website however it cannot guarantee the accuracy, suitability, reliability, completeness, performance or fitness for purpose of the content through the website, and will not accept liability for any loss or damage that may arise directly or indirectly from the content. Information on STOX website can be subjected to change without notice and is provided for the primary purpose of facilitating users to arrive at independent decisions. STOX does not provide investment or advisory advice and will have no liability for the use or interpretation of information as stated in its website or other communication mediums. All users of STOX must understand that there are risks involved in trading. STOX encourages all users to exercise prudence and trade responsibly within their own means.While STOX emphasises platform security to ensure the continuity and security of its services (announcements will be made in event of downtime/maintenance), it will be non-accountable to Act of God, malicious targeted hacking, terrorist attacks and other unforeseen circumstances. STOX reserves the right to cancel, rollback or block transactions of all type on its platform in event of abnormal transactions. STOX will not ask for any password from its users nor ask users to transfer funds that are not listed on its trading platform. Users are encouraged to exercise prudence in dealing with discounts or promotions that could lead to them getting scammed. While the list is non-exhaustive, you agree that STOX will not be held responsible for any losses arising from the situations stated above.
                </p>
                <div className="label">
                    Description of services
                </div>
                <p>

                    STOX strives to maintain the accuracy of information posted on its website however it cannot guarantee the accuracy, suitability, reliability, completeness, performance or fitness for purpose of the content through the website, and will not accept liability for any loss or damage that may arise directly or indirectly from the content. Information on STOX website can be subjected to change without notice and is provided for the primary purpose of facilitating users to arrive at independent decisions. STOX does not provide investment or advisory advice and will have no liability for the use or interpretation of information as stated in its website or other communication mediums. All users of STOX must understand that there are risks involved in trading. STOXencourages all users to exercise prudence and trade responsibly within their own means.While STOX emphasises platform security to ensure the continuity and security of its services (announcements will be made in event of downtime/maintenance), it will be non-accountable to Act of God, malicious targeted hacking, terrorist attacks and other unforeseen circumstances. STOX reserves the right to cancel, rollback or block transactions of all type on its platform in event of abnormal transactions. STOX will not ask for any password from its users nor ask users to
                    transfer funds that are not listed on its trading platform. Users are encouraged to exercise prudence in dealing with iscounts or promotions that could lead to them getting scammed. While the list is non-exhaustive, you agree that STOX will not be held responsible for any losses arising from the situations stated above.
                </p>
                <div className="label">
                    Termination of Agreement
                </div>
                <p>

                    You agree that we have the right to immediately suspend your account (and any accounts beneficially owned by related entities or affiliates), freeze or lock the funds in all such accounts, and suspend your access to STOX if we suspect any such accounts to be in violation of the Terms of Service, Privacy Policy, AML/CTF acts or any applicable laws & regulations. STOX shall have the right to keep and use the transaction data or other information related to such accounts. The above account controls may also be applied in the following cases:
                    <span className="item">● The account is subject to a governmental proceeding, criminal investigation or other pending litigation</span>
                    <span className="item">● We detect unusual activity in the account</span>
                    <span className="item">● We detect unauthorized access to the account</span>
                    <span className="item">● We are required to do so by a court order or command by a regulatory/government authority</span>
                    In case of any of the following events, STOX shall have the right to directly terminate this agreement by cancelling your account, and shall have the right to permanently freeze (cancel) the authorizations of your account on STOX and withdraw the corresponding STOX account thereof:
                    <span className="item">● after STOX terminates services to you,</span>
                    <span className="item">● you allegedly register or register in any other person’s name as STOX user again, directly or indirectly;</span>
                    <span className="item">● the main content of user’s information that you have provided is untruthful, inaccurate, outdated or incomplete;</span>
                    <span className="item">● when this agreement (including the rules) is amended, you expressly state and notify STOX of your unwillingness to accept the amended service agreement;</span>
                    <span className="item">● any other circumstances where STOX deems it should terminate the services.</span>
                    Should the account be terminated, the account & transactional information required for meeting data retention standards will be securely stored for five years. In addition, if a transaction is unfinished during the account termination process, STOX shall have the right to notify your counterparty of the situation at that time.
                </p>

                {/*<button className="btn btn-agree" onClick={this.agree.bind(this)}>I Agree</button>*/}
            </div>
        );
    }
}

export default Index;