import React from 'react'
import intl from 'react-intl-universal'
import { getPageName, isLogin, isLangZH, jumpUrl } from '@/utils'
import { removeToken } from '@/utils/auth'
import { logout } from '@/api'
import { LANG } from '@/data/static'
import '@/public/css/common.pcss'
import phoneImg from '@/public/img/phone.png'
import logoImg from '@/public/img/logo.png'
import userUpImg from '@/public/img/个人中心up.png'
import userDownImg from '@/public/img/个人中心down.png'

const activeMenu = getPageName()

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDealSubMenu: false,
            showRuleSubMenu: false,
            showLang: false,
            langLabel: '',
            langSelect: '',
            userImg: ''
        }
    }

    componentDidMount() {
        if(isLangZH()) {
            this.setState({
                langSelect: 'English',
                langLabel: '简体中文'
            })
        } else {
            this.setState({
                langSelect: '简体中文',
                langLabel: 'English'
            })
        }
        if(activeMenu === 'user') {
            this.setState({
                userImg: userDownImg
            })
        } else {
            this.setState({
                userImg: userUpImg
            })
        }
    }

    componentWillUnmount() {
    }

    showSubmenu(status) {
        let obj = {}
        obj[status] = true
        this.setState(obj)
    }

    hideSubmenu(status) {
        let obj = {}
        obj[status] = false
        this.setState(obj)
    }

    userToolEnter() {
        this.showSubmenu('showUserTool')
        this.setState({
            userImg: userUpImg
        })
    }

    userToolLeave() {
        this.hideSubmenu('showUserTool')
        if(activeMenu === 'user') {
            this.setState({
                userImg: userDownImg
            })
        }
    }

    // 切换语言
    changeLang() {
        if(this.state.langSelect === 'English') {
            localStorage.setItem(LANG.name, LANG.en)
        } else {
            localStorage.setItem(LANG.name, LANG.zh)
        }
        this.setState({
            langSelect: this.state.langLabel,
            langLabel: this.state.langSelect,
            showLang: false
        })
        window.location.reload()
    }

    logout() {
        logout().then(() => {
            removeToken()
            jumpUrl('index.html')
        })
    }

    render() {
        return (
            <div className="a-header">
                <div className="header-wrap">
                    <div className="logo-wrap">
                        <img src={logoImg} alt="" className="logo"/>
                    </div>
                    <div className="content clearfix">
                        <nav className="nav">
                            <a className={activeMenu === 'index' ? 'menu active' : 'menu'}  href="index.html">{intl.get('name')}</a>
                            <a className={activeMenu === 'download' ? 'menu active' : 'menu'} href="download.html">{intl.get('download')}</a>
                            <span className={activeMenu === 'deal' ? 'menu active' : 'menu'}
                                  onMouseEnter={this.showSubmenu.bind(this, 'showDealSubMenu')}
                                  onMouseLeave={this.hideSubmenu.bind(this, 'showDealSubMenu')}>{intl.get('dealCenter')}
                                {this.state.showDealSubMenu && (
                                    <ul className="submenu-wrap">
                                        {/*<li><a className="sub-menu" href="index.html">OTC</a></li>*/}
                                        <li><a className="sub-menu" href="deal.html">{intl.get('coinsDeal')}</a></li>
                                    </ul>
                                )}
                            </span>
                            <a className={activeMenu === 'news' ? 'menu active' : 'menu'} href="news.html">{intl.get('news')}</a>
                            <a className={activeMenu === 'help' ? 'menu active' : 'menu'} href="help.html">{intl.get('support')}</a>
                            {/*<span className={activeMenu === 'rule' ? 'menu active' : 'menu'}*/}
                                  {/*onMouseEnter={this.showSubmenu.bind(this, 'showRuleSubMenu')}*/}
                                  {/*onMouseLeave={this.hideSubmenu.bind(this, 'showRuleSubMenu')}>{intl.get('rule')}*/}
                                {/*{this.state.showRuleSubMenu && (*/}
                                    {/*<ul className="submenu-wrap">*/}
                                        {/*<li><a className="sub-menu" href="rule-service.html">{intl.get('terms')}</a></li>*/}
                                        {/*<li><a className="sub-menu" href="rule-rate.html">{intl.get('fee')}</a></li>*/}
                                        {/*<li><a className="sub-menu" href="rule-manage.html">{intl.get('rules')}</a></li>*/}
                                    {/*</ul>*/}
                                {/*)}*/}
                            {/*</span>*/}
                            {/*<a className={activeMenu === 'about' ? 'menu active' : 'menu'} href="index.html">{intl.get('aboutUs')}</a>*/}
                            {isLogin() && (
                                <a className={activeMenu === 'feedback' ? 'menu active' : 'menu'} href="feedback.html">{intl.get('feedback')}</a>
                            )}
                        </nav>
                        <div className="login-register">
                            {/*<span className="phone"><img src={phoneImg} style={{marginRight: '5px'}} alt=""/>400-666-666</span>*/}
                            {!isLogin() && (
                                <span>
                                    <a className="btn btn-login" href="login.html">{intl.get('login')}</a>
                                    <a className="btn btn-primary" href="register.html">{intl.get('register')}</a>
                                </span>
                            )}
                            {isLogin() && (
                                <span className="user-tool-wrap nav">
                                    <span className={(activeMenu === 'user' && !this.state.showUserTool) ? 'menu active' : 'menu'} onMouseEnter={this.userToolEnter.bind(this)}
                                       onMouseLeave={this.userToolLeave.bind(this)}>
                                        <a className="user-link" href="user.html"><img className="user-img" src={this.state.userImg} alt=""/>{intl.get('personalCenter')}</a>
                                        {this.state.showUserTool && (
                                            <ul className="submenu-wrap user-tool-list">
                                                <li><a className="sub-menu" href="javascript:" onClick={this.logout.bind(this)}>{intl.get('logout')}</a></li>
                                            </ul>
                                        )}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="lang-select" onMouseEnter={this.showSubmenu.bind(this, 'showLang')}
                         onMouseLeave={this.hideSubmenu.bind(this, 'showLang')}>
                        <button className="btn-lang">{this.state.langLabel}</button><i className="icon icon-arrow-down"></i>
                        {this.state.showLang && (
                            <ul className="lang-wrap">
                                <li onClick={this.changeLang.bind(this)}>{this.state.langSelect}</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Header