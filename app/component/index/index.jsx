import React from 'react';
import '@/public/css/index.pcss';
import Banner from './Banner'
import Content from './Content'
import Introduce from './Introduce'

const Index = () => {
    return (
        <div className="home">
            <Banner/>
            <Content/>
            <Introduce/>
        </div>
    )
}

export default Index;