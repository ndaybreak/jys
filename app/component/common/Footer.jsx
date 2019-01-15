import React from 'react';
import emailIcon from '@/public/img/user_email.png';
import facebookIcon from '@/public/img/facebook.png';
import twitterIcon from '@/public/img/twitter.png';
import redditIcon from '@/public/img/reddit.png';
import telegramIcon from '@/public/img/telegram.png';
import linkinIcon from '@/public/img/linkin.png';
import linkDotIcon from '@/public/img/dot.png';

class Logo extends React.Component {

    initOutLinkButtons() {
        // {iconPath, linkPath, altWord}
        const outLinks = [{iconPath: facebookIcon, linkPath: 'https://www.baidu.com'},
            {iconPath: twitterIcon, linkPath: 'https://twitter.com/hkstox/'},
            {iconPath: telegramIcon, linkPath: 'https://t.me/joinchat/GwfM7gxO0UGXPFhvjCxzrw'},
            {iconPath: redditIcon, linkPath: 'https://www.reddit.com/user/hkstox/'},
            {iconPath: linkinIcon, linkPath: 'https://www.baidu.com'}].map((val) => {
            return <div className={'out-link-wrap'} key={val.linkPath}><a href={val.linkPath}><img
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
                <span className={'support-email'}>Email: support@hkstox.io</span>
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


class Contact extends React.Component {
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
            <div className={'company-address-wrap'}>
                <div className={'company-address'}>
                    Unit 4308,Far East Finance Center,No.16 Harcourt Road,
                </div>
                <div className={'company-address'}>Admiralty,Hong Kong Phone: 852 3528 0178 FAX: 852 3258 0371</div>
            </div>
        </div>)
    }
}

class Footer extends React.Component {

    render() {
        const legal = [{linkPath: 'http://www.baicu.com', linkTitle: 'Terms of Service'},
            {linkPath: 'http://www.baicu.com', linkTitle: 'Prvacy Policy'}];
        const information = [
            {linkTitle: 'Fees', linkPath: 'fees.html'},
            {linkPath: 'news.html', linkTitle: 'Announcement and News'},
            {linkPath: 'help.html', linkTitle: 'FAQ and Support'}];
        const contact = [{linkPath: 'feedback', linkTitle: 'Feed back'}]
        return <div className="a-footer">
            <div className={"footer-wrap"}>
                <Logo/>
                <ListBlock blockTitle={'Legal'} linkArray={legal}/>
                <ListBlock blockTitle={'Information'} linkArray={information}/>
                <Contact blockTitle={'Contact'} linkArray={contact}/>
            </div>
        </div>
    }

}


export default Footer;