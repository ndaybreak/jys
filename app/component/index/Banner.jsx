import React from 'react';
import bannerOneText from '@/public/img/banner_one_text.png'
import bannerTwoText from '@/public/img/banner_two_text.png'
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
        <Carousel autoplay arrows={true} prevArrow={getPrevArrow()} nextArrow={getNextArrow()}>
            <div className={'banner ' + (isLangZH() ? 'banner-one' : 'banner-one-en')}>
                {/*<img src={bannerOneText} alt="" style={{display: 'inline-block'}}/>*/}
            </div>
            {/*<div className="banner banner-two">*/}
                {/*<img src={bannerTwoText} alt="" style={{display: 'inline-block'}}/>*/}
            {/*</div>*/}
        </Carousel>
    )
}

export default Banner