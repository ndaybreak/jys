import React from 'react';
import '@/public/css/index.pcss';
import Banner from './Banner'
import Content from './Content'

const Index = () => {
    return (
        <div className="home">
            <Banner/>
            <Content/>
        </div>
    )
}

export default Index;