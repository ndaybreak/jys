import intl from "react-intl-universal";
import _ from "lodash";
import http from "axios";
import React from 'react';
import 'antd/dist/antd.css';
import Header from '@/component/common/Header';
import Footer from '@/component/common/Footer';
import { LANG } from '@/data/static'

const SUPPOER_LOCALES = [
    {
        name: "English",
        value: LANG.en
    },
    {
        name: "简体中文",
        value: LANG.zh
    }
]

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initDone: false
        }
    }

    componentDidMount() {
        this.loadLocales();
    }

    componentWillUnmount() {
    }

    loadLocales() {
        // let currentLocale = intl.determineLocale({
        //     urlLocaleKey: "lang",
        //     cookieLocaleKey: "lang"
        // });
        let currentLocale = localStorage.getItem(LANG.name)
        if (!_.find(SUPPOER_LOCALES, { value: currentLocale })) {
            // currentLocale = "en-US";
            localStorage.setItem(LANG.name, LANG.zh)
            currentLocale = LANG.zh;
        }

        http.get(`resource/locales/${currentLocale}.json`)
            .then(res => {
                console.log("App locale data", res.data);
                // init method will load CLDR locale data according to currentLocale
                return intl.init({
                    currentLocale,
                    commonLocaleDataUrls: {
                        zh: 'resource/locales/zh.js',
                        en: 'resource/locales/zh.js'
                    },
                    locales: {
                        [currentLocale]: res.data
                    }
                });
            })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({ initDone: true });
            });
    }

    render() {
        const getContent = (Page) => {
            return <Page></Page>
        }
        return (
            this.state.initDone &&
            <div className="app-inner">
                <Header key="Header"/>
                <div key="Content" className="a-content">{getContent(this.props.page)}</div>
                <Footer key="Footer"/>
            </div>
        );
    }
}

export default App