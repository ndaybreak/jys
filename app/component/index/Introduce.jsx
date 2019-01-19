import React from 'react';
import img_1 from '@/public/img/icon_home_1.png'
import img_2 from '@/public/img/icon_home_2.png'
import img_3 from '@/public/img/icon_home_3.png'
import img_4 from '@/public/img/icon_home_4.png'
import img_5 from '@/public/img/icon_home_5.png'
import img_6 from '@/public/img/icon_home_6.png'
import 'antd/lib/carousel/style/css';
import { getPageName, isLogin, isLangZH, jumpUrl } from '@/utils'

const Introduce = () => {
    return (
        <div className="intro-wrap">
            <div className="intro-wrap-inner">
                <div className="clearfix" style={{marginBottom: '66px'}}>
                    <div className="intro-item intro-item-left">
                        <div className="intro-icon"><img src={img_1} alt=""/></div>
                        <div className="intro-label">Strictly Registration Process</div>
                        <div className="intro-info">
                            Qualified Customers will be required to complete online investor surveys, virtual asset knowledge assessment and video certification.
                        </div>
                    </div>
                    <div className="intro-item intro-item-center">
                        <div className="intro-icon"><img src={img_2} alt=""/></div>
                        <div className="intro-label">Financial Intuitional Level KYC & AML</div>
                        <div className="intro-info">
                            Customers’ information and strict compliance review of KYC, AML, etc. will be required to allow Qualified Customers to deposit/withdraw and trade.
                        </div>
                    </div>
                    <div className="intro-item intro-item-right">
                        <div className="intro-icon"><img src={img_3} alt=""/></div>
                        <div className="intro-label">Fully Secured Virtual Assets</div>
                        <div className="intro-info">
                            Virtual Assets are fully secured by multi-layered encryption and hot and cold wallet isolation mechanism in cooperation with professional third-party digital/virtual asset security technology companies
                        </div>
                    </div>
                </div>
                <div className="clearfix">
                    <div className="intro-item intro-item-left">
                        <div className="intro-icon"><img src={img_4} alt=""/></div>
                        <div className="intro-label">Reliable Trading Platform</div>
                        <div className="intro-info">
                            Trading Platform adopts multiple authentication and inspection, anti-phishing mechanism, and data and system multi-point backup to ensure its security
                        </div>
                    </div>
                    <div className="intro-item intro-item-center">
                        <div className="intro-icon"><img src={img_5} alt=""/></div>
                        <div className="intro-label">Fast & Stable Trading Engine</div>
                        <div className="intro-info">
                            A robus and scalable trading engine supports fast order matching and execution.
                        </div>
                    </div>
                    <div className="intro-item intro-item-right">
                        <div className="intro-icon"><img src={img_6} alt=""/></div>
                        <div className="intro-label">Professional Team</div>
                        <div className="intro-info">
                            Global elite team with strong financial background and technical strength
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Introduce