import React from 'react';
import emailIcon from '@/public/img/user_email.png';
import facebookIcon from '@/public/img/facebook.png';
import twitterIcon from '@/public/img/twitter.png';
import redditIcon from '@/public/img/reddit.png';
import telegramIcon from '@/public/img/telegram.png';
import linkinIcon from '@/public/img/linkin.png';
import linkDotIcon from '@/public/img/dot.png';
import { getPageName, isLogin, isLangZH, jumpUrl } from '@/utils'

class Logo extends React.Component {

    initOutLinkButtons() {
        // FIXME facebook 和 领英超链接
        const outLinks = [
            {iconPath: facebookIcon, linkPath: 'https://www.hkstox.com'},
            {iconPath: twitterIcon, linkPath: 'https://twitter.com/hkstox/'},
            {iconPath: telegramIcon, linkPath: 'https://t.me/joinchat/GwfM7gxO0UGXPFhvjCxzrw'},
            {iconPath: redditIcon, linkPath: 'https://www.reddit.com/user/hkstox/'},
            {iconPath: linkinIcon, linkPath: 'https://www.hkstox.com'}].map((val, i) => {
            return <div className={'out-link-wrap'} key={i}><a href={val.linkPath}><img
                className={'out-link-img'}
                src={val.iconPath}/>
            </a>
            </div>
        })
        return <div className={'out-link'}>
            {outLinks}
        </div>
    }

    render() {
        const outLinks = this.initOutLinkButtons();
        return (<div className={'logo'}>
            <div className={'logo-font'}>HKSTOx</div>
            <div className={'support-wrap'}>
                <img className={'support-email-img'} src={emailIcon}></img>
                <span className={'support-email'}>Email: <span> support@hkstox.io</span></span>
            </div>
            {outLinks}
        </div>)
    }
}

class ListBlock extends React.Component {
    render() {
        const listLink = this.props.linkArray ?
            (
                this.props.linkArray.map((val) => {
                    return <div className={'link-item-wrap'} key={val.linkTitle}>
                        <img className={'link-item-img'} src={linkDotIcon}></img>
                        <a href={val.linkPath}>
                        <span
                            className={'link-block-item'}>{val.linkTitle}</span></a>
                    </div>
                })
            ) : "";
        return (<div className={'link-block-wrap'}>
            <p className={'link-block-title'}>{this.props.blockTitle}</p>
            {listLink}
        </div>)
    }
}

class Footer extends React.Component {
    goFeedback() {
        if(isLogin()) {
            jumpUrl('feedback.html')
        } else {
            jumpUrl('login.html')
        }
    }

    render() {
        const legal = [{linkPath: 'terms-of-service.html', linkTitle: 'Terms of Service'},
            {linkPath: 'privacy-policy.html', linkTitle: 'Privacy Policy'}];
        const information = [
            {linkTitle: 'Fees', linkPath: 'fees.html'},
            {linkPath: 'news.html', linkTitle: 'Announcement and News'},
            {linkPath: 'help.html', linkTitle: 'FAQ and Support'}];
        return <div className="a-footer">
            <div className={"footer-wrap"}>
                <Logo/>
                <ListBlock key={'Legal'} blockTitle={'Legal'} linkArray={legal}/>
                <ListBlock key={'Information'} blockTitle={'Information'} linkArray={information}/>

                <div className={'link-block-wrap'}>
                    <p className={'link-block-title'}>Contact</p>
                    <div className={'link-item-wrap'}>
                        <img className={'link-item-img'} src={linkDotIcon}></img>
                        <a href="javascript:" onClick={this.goFeedback.bind(this)}><span className={'link-block-item'}>Feedback</span></a>
                    </div>
                    <div className={'company-address-wrap'}>
                        <div className={'company-address'}>
                            Unit 4308,Far East Finance Center,No.16 Harcourt Road,Admiralty,Hong Kong
                        </div>
                        <div className={'company-address'}>Phone: <span>852 3528 0178</span> FAX: <span>852 3258 0371</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

}


export default Footer;