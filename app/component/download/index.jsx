import React from 'react';
import intl from 'react-intl-universal'
import { getPageName, isLogin, isLangZH, jumpUrl } from '@/utils'
import '@/public/css/download.pcss';
import { Carousel } from 'antd';
import 'antd/lib/carousel/style/css';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            showFade: false
        }
    }

    componentDidMount() {
        setTimeout(()=> {
            this.setState({
                showFade: true,
            })
        }, 0)
    }

    componentWillUnmount() {
    }

    carouselChange(from, currentIndex) {
        this.setState({
            activeIndex: currentIndex
        })
    }

    changeActiveIndex(index) {
        this.setState({
            activeIndex: index
        })
        this.carouselRef.goTo(index)
    }

    carouselCB(ref) {
        if(ref) {
            // this.setState({
            //     carouselRef: ref
            // })
            this.carouselRef = ref
        }
    }

    render() {
        return (
            <div className={isLangZH() ? 'download-page' : 'download-page download-page-en'}>
                <div className={isLangZH() ? 'banner' : 'banner-en'}></div>
                <div className="download-content">
                    <div className={`btn-wrap txt-center ${this.state.showFade ? 'fade' : ''}`}>
                        <button className={`btn-download ${this.state.activeIndex === 0 ? 'active' : ''}`} onClick={this.changeActiveIndex.bind(this, 0)}>{intl.get('otc')}</button>
                        <button className={`btn-download ${this.state.activeIndex === 1 ? 'active' : ''}`} onClick={this.changeActiveIndex.bind(this, 1)}>{intl.get('coinsDeal')}</button>
                        <button className={`btn-download ${this.state.activeIndex === 2 ? 'active' : ''}`} onClick={this.changeActiveIndex.bind(this, 2)}>{intl.get('referralRebate')}</button>
                    </div>
                    <div className="carousel-wrap">
                        <Carousel autoplay ref={this.carouselCB.bind(this)} dots="false" beforeChange={this.carouselChange.bind(this)}>
                            <div className="slide-wrap slide-one clearfix">
                                <div className="left">
                                    <div className="img"></div>
                                </div>
                                <div className="right">
                                    <div className="item"><span className="icon"></span></div>
                                    <div className="item">{intl.get('download_1')}</div>
                                    <div className="item">{intl.get('download_2')}</div>
                                </div>
                            </div>
                            <div className="slide-wrap slide-two clearfix">
                                <div className="left">
                                    <div className="img"></div>
                                </div>
                                <div className="right">
                                    <div className="item"><span className="icon"></span></div>
                                    <div className="item">{intl.get('download_3')}</div>
                                    <div className="item">{intl.get('download_4')}</div>
                                </div>
                            </div>
                            <div className="slide-wrap slide-three clearfix">
                                <div className="left">
                                    <div className="img"></div>
                                    <div className="recommend-txt clearfix">
                                        <div className="re-left">
                                            <div><span className="recommend-icon1"></span> {intl.get('download_5')}</div>
                                            <div>15{intl.get('download_6')}</div>
                                        </div>
                                        <div className="re-right">
                                            <div><span className="recommend-icon2"></span> {intl.get('download_7')}</div>
                                            <div>0.12246 BTC</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="item"><span className="icon"></span></div>
                                    <div className="item">{intl.get('download_8')}</div>
                                    <div className="item">{intl.get('download_9')}</div>
                                </div>
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;