import React from 'react';
import bannerOneText from '@/public/img/banner_one_text.png'
import bannerTwoText from '@/public/img/banner_two_text.png'
import featureImg_1 from '@/public/img/icon_feature_1.png'
import featureImg_2 from '@/public/img/icon_feature_2.png'
import featureImg_3 from '@/public/img/icon_feature_3.png'
import { Carousel } from 'antd';
import 'antd/lib/carousel/style/css';
import NextArrow from '@/component/common/NextArrow'
import PrevArrow from '@/component/common/PrevArrow'
import { getPageName, isLogin, isLangZH, jumpUrl } from '@/utils'

const getNextArrow = () => {
    return <NextArrow/>
}
const getPrevArrow = () => {
    return <PrevArrow/>
}

const Banner = () => {
    return (
        <div className="blue-banner-wrap">
            <div className="banner-inner">
                <div className="info-1"> The Trusted Platform For <span>Virtual Asset</span> Exchange</div>
                <div className="info-2">Our mission is to build the world's most trusted trading platform which bridges the gap between classic investors <br/>
                    and the innovative virtual asset world</div>
                <div className="features-wrap clearfix">
                    <div className="feature">
                        <div className="feature-icon"><img src={featureImg_1} alt=""/></div>
                        <div className="feature-info">Round-The-Clock Trading</div>
                        <div className="feature-info">Safety And Stabillity</div>
                    </div>
                    <div className="feature">
                        <div className="feature-icon"><img src={featureImg_2} alt=""/></div>
                        <div className="feature-info">The Highly Trusted Platform For</div>
                        <div className="feature-info">Virtual Asset Exchange</div>
                    </div>
                    <div className="feature">
                        <div className="feature-icon"><img src={featureImg_3} alt=""/></div>
                        <div className="feature-info">Recommend Registration Win</div>
                        <div className="feature-info">High Referral Rewards</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// const Banner = () => {
//     return (
//         <Carousel autoplay arrows={true} prevArrow={getPrevArrow()} nextArrow={getNextArrow()}>
//             <div className={'banner ' + (isLangZH() ? 'banner-one' : 'banner-one-en')}>
//                 {/*<img src={bannerOneText} alt="" style={{display: 'inline-block'}}/>*/}
//             </div>
//             {/*<div className="banner banner-two">*/}
//                 {/*<img src={bannerTwoText} alt="" style={{display: 'inline-block'}}/>*/}
//             {/*</div>*/}
//         </Carousel>
//     )
// }

export default Banner