import React from 'react';
import '@/public/css/rule.pcss'
import '@/public/css/rule-manage.pcss';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div className="rule-page">
                <div className="title">规则</div>
                <ul className="rule-toolbar">
                    <li className="tool-item"><a href="rule-service.html">服务条款</a></li>
                    <li className="tool-item tool-rate"><a href="rule-rate.html">费率说明</a></li>
                    <li className="tool-item active"><a href="rule-manage.html">管理规则</a></li>
                </ul>
                <div className="rule-content content-service">
                    <div className="module">
                        <div className="module-title">【最新修订】： 2018. 05 .24</div>
                        <p>
                            本协议是您与服务提供商泰沃之间就使用任何由泰沃网（https://www.taiwo.com）， 泰沃API (https://api.taiwo.com)以及泰沃相关公司提供的服务时，所达成的权力义务关系的协议。请确认您已阅读、理解，并接受所有本文包含的条款以及纳入通用数据保护条例（GDPR）的隐私政策。 由于此协议具有法律约束力，请在使用我们的服务前仔细阅读。注册访问和使用泰沃，表示您已同意本协议中所有条款。如有异议，请您保持账户锁定状态（针对现有用户）并停止使用币安。
                            更多信息请参考币安官网。<br/>
                            如果您对本协议有任何疑问，请联系我们的客户服务团队（https://support.taiwo.com/hc/en-us/requests/new）
                        </p>
                    </div>
                    <div className="module">
                        <div className="module-title">协议条件</div>
                        <p>
                            我方保留随时修改本协议条款的权力，修订通知将公布在以下链接并在协议中附最新修订时间：“【最新修订：****年**月**日】”(https://support.taiwo.com/hc/en-us/articles/115000421672-Terms-of-Use)。最新版将于网站发布及向用户发布后立即生效。 继续使用泰沃服务将视为您接受修改后的最新协议。
                        </p>
                    </div>
                    <div className="module">
                        <div className="module-title">适用条件</div>
                        <p>
                            您确认，在您完成注册程序或以其他泰沃允许的方式实际使用币安服务时，您应当是具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织。若您不具备前述主体资格，则您及您的监护人应承担因此而导致的一切后果，且泰沃有权注销或永久冻结您的账户，并向您及您的监护人索偿。
                        </p>
                    </div>
                    <div className="module">
                        <div className="module-title">禁用条件</div>
                        <p>
                            在访问和使用泰沃及其相关服务时，您需确保您不在任何贸易或经济制裁名单中，如联合国安理会制裁及其他任何同类名单。 泰沃保留其选择服务市场和司法管辖区的权利，并可能限制或拒绝对某些特定国家提供服务。本协议的内容不得排除在用户所在国的法律之外。泰沃会禁止黑名单用户使用与泰沃相关的任何服务。
                        </p>
                        <p>
                            区块链技术目前仍处于起步阶段，还有很大的改进和发展空间。审时度势的企业家们正在继续测试和开发新方法，将其应用在一些依赖于维护交易记录和所有权的行业中。借贷行业可以通过区块链技术来降低成本，缩短处理时间，并提高贷款服务效率，从而获得很多收益。
                        </p>
                    </div>
                    <div className="module">
                        <div className="module-title">赔偿和免责声明</div>
                        <p>
                            除非泰沃违反这些条款，您同意赔偿币安及其相关联公司免于承担第三方索赔。如服务描述中所述，泰沃尽全力维护其网站的数据完整性，但不对平台中提供的信息和服务做任何保证。币安不承担因使用其服务而导致的损失。
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;