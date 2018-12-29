import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import intl from 'react-intl-universal'

import CoinList from './CoinList';
import IndicatorList from './IndicatorList';

import React from "react";
import PropTypes from "prop-types";

import indicatorImgUp from '@/public/img/指标1.png'
import indicatorImgDown from '@/public/img/指标2.png'

import { ChartCanvas, Chart } from "react-stockcharts";
import {
    BarSeries,
    AreaSeries,
    CandlestickSeries,
    LineSeries,
    MACDSeries,
    RSISeries,
    BollingerSeries
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
    CrossHairCursor,
    EdgeIndicator,
    CurrentCoordinate,
    MouseCoordinateX,
    MouseCoordinateY
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProviderBuilder } from "react-stockcharts/lib/scale";
import {
    OHLCTooltip,
    MovingAverageTooltip,
    MACDTooltip,
    GroupTooltip,
    RSITooltip,
    BollingerBandTooltip
} from "react-stockcharts/lib/tooltip";
import { ema, sma, macd, rsi, bollingerBand } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";

import { getIntervalQuot, getIntervalReq } from '@/api/quot'
import eventProxy from '@/utils/eventProxy'
import { deepClone } from '@/utils'

function getMaxUndefined(calculators) {
    return calculators
        .map(each => each.undefinedLength())
        .reduce((a, b) => Math.max(a, b));
}

const PARA = {
    targetPair: {
        mainCoinCode: '',
        targetCoinCode: ''
    },
    interval: '1m',
    number: 300
}
let loadMorePara = Object.assign({latestTime: 0}, PARA, {number: 300})

let timeType = 'time'

const indicatorMap = {
    ema: {
        key: 'ema',
        name: 'EMA',
        isSelected: true,
        isSubChart: false,
        index: 1
    },
    boll: {
        key: 'boll',
        name: 'Bollinger Bands',
        isSelected: false,
        isSubChart: false,
        index: 2
    },
    vol: {
        key: 'vol',
        name: 'VOL',
        isSelected: true,
        isSubChart: true,
        height: 50,
        index: 6
    },
    macd: {
        key: 'macd',
        name: 'MACD',
        isSelected: false,
        isSubChart: true,
        height: 80,
        index: 7
    },
    rsi: {
        key: 'rsi',
        name: 'RSI',
        isSelected: false,
        isSubChart: true,
        height: 100,
        index: 8
    }
}

const getSubChartHeight = (obj) => {
    for(var attr in obj) {
        if(obj.hasOwnProperty(attr)) {
            if(obj[attr]['isSubChart'] && obj[attr]['isSelected']) {
                return obj[attr]['height']
            }
        }
    }
    return 0
}

class CandleStickChartPanToLoadMore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            suffix: 1,
            indicatorImg: indicatorImgUp,
            indicatorMap: indicatorMap
        }

        eventProxy.on('coinsUpdate', (data) => {
            this.setState({
                target: data.target,
                base: data.base
            }, () => {
                this.loadData()
            })
        })
    }

    loadData() {
        let isInit = true
        let targetPair = {
            mainCoinCode: this.state.target,
            targetCoinCode: this.state.base
        }
        PARA.targetPair = targetPair
        PARA.interval = timeType === 'time' ? '1m' : timeType
        loadMorePara.targetPair = targetPair
        loadMorePara.interval = timeType === 'time' ? '1m' : timeType
        getIntervalQuot(PARA, data => {
            const originData = this.state.data
            if(isInit) {
                console.log(timeType, data)
                isInit = false
                this.init(data)
            } else if(data[data.length -1].date.getTime() !== this.state.data[this.state.data.length - 1].date.getTime()) {
                this.append(originData.concat([data[data.length - 1]]))
            }
        })
    }

    init(inputData) {
        const ema5 = ema()
            .id(0)
            .options({ windowSize: 5 })
            .merge((d, c) => {
                d.ema5 = c;
            })
            .accessor(d => d.ema5);

        const ema10 = ema()
            .id(1)
            .options({ windowSize: 10 })
            .merge((d, c) => {
                d.ema10 = c;
            })
            .accessor(d => d.ema10);

        const macdCalculator = macd()
            .options({
                fast: 12,
                slow: 26,
                signal: 9
            })
            .merge((d, c) => {
                d.macd = c;
            })
            .accessor(d => d.macd);

        const smaPrice5 = sma()
            .id(3)
            .options({
                windowSize: 5,
                sourcePath: "close"
            })
            .merge((d, c) => {
                d.smaPrice5 = c;
            })
            .accessor(d => d.smaPrice5);

        const rsiCalculator = rsi()
            .options({ windowSize: 14 })
            .merge((d, c) => {d.rsi = c;})
            .accessor(d => d.rsi);

        const bb = bollingerBand()
            .merge((d, c) => {d.bb = c;})
            .accessor(d => d.bb);

        // const maxWindowSize = getMaxUndefined([
        //     ema5,
        //     ema10,
        //     macdCalculator,
        //     smaPrice5
        // ]);
        /* SERVER - START */
        // const dataToCalculate = inputData.slice(-inputData.length + 55);
        const dataToCalculate = inputData

        const calculatedData = ema5(
            ema10(smaPrice5(rsiCalculator(macdCalculator(bb(dataToCalculate)))))
        );
        const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

        const { index } = indexCalculator(calculatedData);
        /* SERVER - END */

        const xScaleProvider = discontinuousTimeScaleProviderBuilder().withIndex(
            index
        );
        const {
            data: linearData,
            xScale,
            xAccessor,
            displayXAccessor
        } = xScaleProvider(calculatedData.slice(-120));
        // } = xScaleProvider(calculatedData.slice(timeType === 'time' ? -190 : -120));

        // console.log(head(linearData), last(linearData))
        // console.log(linearData.length)

        const state = {
            ema5,
            ema10,
            macdCalculator,
            smaPrice5,
            rsiCalculator,
            bb,
            linearData,
            data: linearData,
            xScale,
            xAccessor,
            displayXAccessor,
            initialIndex: 0
        }
        this.setState(state)
    }

    saveCanvas(node) {
        this.canvas = node;
    };
    append(newData) {
        const {
            ema5,
            ema10,
            macdCalculator,
            smaPrice5,
            rsiCalculator,
            bb,
            initialIndex
        } = this.state;

        // const maxWindowSize = getMaxUndefined([
        //     ema5,
        //     ema10,
        //     macdCalculator,
        //     smaPrice5
        // ]);
        /* SERVER - START */
        // const dataToCalculate = newData.slice(
        //     -this.canvas.fullData.length - maxWindowSize
        // );
        const dataToCalculate = newData

        const calculatedData = ema5(
            ema10(smaPrice5(rsiCalculator(macdCalculator(bb(dataToCalculate)))))
        );
        const indexCalculator = discontinuousTimeScaleProviderBuilder()
            .initialIndex(initialIndex)
            .indexCalculator();

        const { index } = indexCalculator(calculatedData);
        /* SERVER - END */

        const xScaleProvider = discontinuousTimeScaleProviderBuilder()
            .initialIndex(initialIndex)
            .withIndex(index);
        const {
            data: linearData,
            xScale,
            xAccessor,
            displayXAccessor
        } = xScaleProvider(calculatedData);

        // console.log(head(linearData), last(linearData))
        // console.log(linearData.length)

        this.setState({
            ema5,
            ema10,
            macdCalculator,
            smaPrice5,
            rsiCalculator,
            bb,
            linearData,
            data: linearData,
            xScale,
            xAccessor,
            displayXAccessor
        });
    };

    handleDownloadMore(start, end) {
        if (Math.ceil(start) === end) return;
        loadMorePara.latestTime = this.state.data[0].date.getTime()
        getIntervalReq(loadMorePara, data => {
            data.splice(data.length - 1)
            const inputData = data
            const {
                data: prevData,
                ema5,
                ema10,
                macdCalculator,
                smaPrice5,
                rsiCalculator,
                bb
            } = this.state;

            const rowsToDownload = end - Math.ceil(start);

            // const maxWindowSize = getMaxUndefined([
            //     ema5,
            //     ema10,
            //     macdCalculator,
            //     smaPrice5,
            //     rsiCalculator,
            //     bb
            // ]);

            /* SERVER - START */
            const dataToCalculate = inputData
            //     .slice(
            //     -rowsToDownload - maxWindowSize - prevData.length,
            //     -prevData.length
            // );

            const calculatedData = ema5(
                ema10(smaPrice5(rsiCalculator(macdCalculator(bb(dataToCalculate)))))
            );
            const indexCalculator = discontinuousTimeScaleProviderBuilder()
                .initialIndex(Math.ceil(start))
                .indexCalculator();
            const { index } = indexCalculator(
                calculatedData.slice(-rowsToDownload).concat(prevData)
            );
            /* SERVER - END */

            const xScaleProvider = discontinuousTimeScaleProviderBuilder()
                .initialIndex(Math.ceil(start))
                .withIndex(index);

            const {
                data: linearData,
                xScale,
                xAccessor,
                displayXAccessor
            } = xScaleProvider(calculatedData.slice(-rowsToDownload).concat(prevData));

            this.setState({
                data: linearData,
                xScale,
                xAccessor,
                displayXAccessor,
                initialIndex: Math.ceil(start)
            });

        })
    }

    toggleCoins(type) {
        const isEnter = type === 'enter'
        this.setState({
            showCoins: isEnter
        })
    }
    toggleIndicator(type) {
        const isEnter = type === 'enter'
        this.setState({
            showIndicator: isEnter,
            indicatorImg: this.state.showIndicator ? indicatorImgUp : indicatorImgDown
        })
    }

    changeType(type) {
        timeType = type
        this.loadData()
    }

    fill(d) {
        return d.close > d.open ? "#51a314" : "#ff0000";
    }

    resetIndicator(map) {
        this.setState({
            indicatorMap: map
        })
    }

    render() {
        const height = 430;
        // const height = 580;
        const { type, width } = this.props;
        const margin = { left: 60, right: 70, top: 30, bottom: 30 };
        const gridHeight = height - margin.top - margin.bottom;
        const gridWidth = width - margin.left - margin.right;

        // 横线
        const yGrid = {
            innerTickSize: -1 * gridWidth,
            stroke: 'rgba(0, 0, 0, .1)', // 图表轴线的颜色
            tickStroke: '#111111', //坐标线与坐标值颜色
            tickStrokeOpacity: 0.1,
        }
        // 竖线
        const xGrid = {
            innerTickSize: -1 * gridHeight,
            tickStrokeOpacity: 0,
            stroke: 'rgba(0, 0, 0, .1)'
        }

        const macdAppearance = {
            stroke: {
                macd: "#FF0000",
                signal: "#00F300",
            },
            fill: {
                divergence: "#0bb1ff"
            },
        };
        const rsiAppearance = {
            stroke: {
                line: "#000000",
                top: "#B8C2CC",
                middle: "#8795A1",
                bottom: "#B8C2CC",
                outsideThreshold: "#b30161",
                insideThreshold: "#ec6bff"
            },
            opacity: {
                top: 0.5,
                middle: 1,
                bottom: 0.5
            }
        };

        const mouseEdgeAppearance = {
            textFill: "#542605",
            stroke: "#05233B",
            strokeOpacity: 1,
            strokeWidth: 3,
            arrowWidth: 5,
            fill: "#BCDEFA",
        };

        const bbStroke = {
            top: "#8484f4",
            middle: "transparent",
            bottom: "#8484f4",
        };
        const bbFill = "#e5e5f2";

        const {
            data,
            ema5,
            ema10,
            macdCalculator,
            smaPrice5,
            rsiCalculator,
            bb,
            xScale,
            xAccessor,
            displayXAccessor,
            indicatorMap
        } = this.state;

        const subChartHeight = getSubChartHeight(indicatorMap)

        return (
            <div className="chart-wrap">
                <div className="coin-select-wrap">
                    <span className={'time-type ' + (timeType === 'time' ? 'active' : '')} onClick={this.changeType.bind(this, 'time')}>Time</span>
                    <span className={'time-type ' + (timeType === '1m' ? 'active' : '')} onClick={this.changeType.bind(this, '1m')}>1min</span>
                    <span className={'time-type ' + (timeType === '5m' ? 'active' : '')} onClick={this.changeType.bind(this, '5m')}>5min</span>
                    <span className={'time-type ' + (timeType === '15m' ? 'active' : '')} onClick={this.changeType.bind(this, '15m')}>15min</span>
                    <span className={'time-type ' + (timeType === '30m' ? 'active' : '')} onClick={this.changeType.bind(this, '30m')}>30min</span>
                    <span className={'time-type ' + (timeType === '1h' ? 'active' : '')} onClick={this.changeType.bind(this, '1h')}>1hour</span>
                    <span className={'time-type ' + (timeType === '4h' ? 'active' : '')} onClick={this.changeType.bind(this, '4h')}>4hour</span>
                    <span className={'time-type ' + (timeType === '1d' ? 'active' : '')} onClick={this.changeType.bind(this, '1d')}>1day</span>
                    <span className={'time-type ' + (timeType === '1w' ? 'active' : '')} onClick={this.changeType.bind(this, '1w')}>1week</span>
                    {/*<span className={'time-type ' + (timeType === '1mon' ? 'active' : '')} onClick={this.changeType.bind(this, '1mon')}>1month</span>*/}
                    <span className="coin-select" onMouseEnter={this.toggleCoins.bind(this, 'enter')} onMouseLeave={this.toggleCoins.bind(this, 'leave')}>
                        {this.state.base}/{this.state.target}<i className={'icon icon-arrow-down icon-coin ' + (this.state.showCoins ? 'icon-arrow-up' : '')}></i>
                        <div className={'coin-list-outer ' + (this.state.showCoins ? '' : 'hide')}>
                            <CoinList />
                        </div>
                    </span>

                    <span className="coin-select" onMouseEnter={this.toggleIndicator.bind(this, 'enter')} onMouseLeave={this.toggleIndicator.bind(this, 'leave')}>
                        {intl.get('indicator')}<i className={'icon icon-arrow-down icon-coin ' + (this.state.showIndicator ? 'icon-arrow-up' : '')}></i>
                        <div className={'coin-list-outer indicator-list ' + (this.state.showIndicator ? '' : 'hide')}>
                            <IndicatorList map={deepClone(indicatorMap)} resetIndicator={this.resetIndicator.bind(this)}/>
                        </div>
                    </span>
                </div>
                {data.length > 1 && (
                    <ChartCanvas
                        ratio={0.5}
                        width={width}
                        margin={margin}
                        height={height}
                        type={type}
                        seriesName={`MSFT_${timeType}`}
                        key={`MSFT_${timeType}`}
                        data={data}
                        xScale={xScale}
                        xAccessor={xAccessor}
                        displayXAccessor={displayXAccessor}
                        onLoadMore={this.handleDownloadMore.bind(this)}
                        ref={node => {
                            this.saveCanvas(node);
                        }}
                        xExtents={[0, 120]}
                        // zoomEvent={false}
                    >
                        <Chart
                            id={1}
                            height={370 - subChartHeight}
                            yExtents={[d => [d.high, d.low], ema5.accessor(), ema10.accessor()]}
                            padding={{ top: 0, bottom: 20 }}
                        >
                            <XAxis
                                axisAt="bottom"
                                orient="bottom"
                                {...xGrid}
                                showTicks={false}
                            />
                            <YAxis
                                axisAt="right"
                                orient="right"
                                ticks={4}
                                {...yGrid}
                            />
                            <MouseCoordinateY
                                at="right"
                                orient="right"
                                rectWidth={80}
                                displayFormat={format(".2f")} />

                            {/* 分时图 */}
                            {timeType === 'time' && (
                                <LineSeries yAccessor={d => d.close} stroke="#0bb1ff"/>
                            )}

                            {/* K线图 */}
                            {timeType !== 'time' && (
                                <CandlestickSeries className="testing" fill={this.fill.bind(this)} stroke={this.fill.bind(this)}
                                                   wickStroke={this.fill.bind(this)} clip={false}/>
                            )}

                            <OHLCTooltip origin={[0, -15]} textFill="#0bb1ff" labelFill="#0bb1ff"/>

                            <EdgeIndicator
                                itemType="last"
                                orient="right"
                                edgeAt="right"
                                yAccessor={d => d.close}
                                rectWidth={80}
                                fill={d => (d.close > d.open ? "#51a314" : "#FF0000")}
                            />

                            {/* EMA */}
                            {indicatorMap.ema.isSelected && (
                                <LineSeries yAccessor={ema5.accessor()} stroke="#ffae00" />
                            )}
                            {indicatorMap.ema.isSelected && (
                                <LineSeries yAccessor={ema10.accessor()} stroke="#ff15fc" />
                            )}
                            {indicatorMap.ema.isSelected && (
                                <GroupTooltip
                                    layout="horizontal"
                                    origin={[400, -10]}
                                    // verticalSize={20}
                                    width={90}
                                    onClick={e => console.log(e)}
                                    options={[
                                        {
                                            yAccessor: ema5.accessor(),
                                            yLabel: `${ema5.type()}(${ema5.options().windowSize})`,
                                            valueFill: '#ffae00',
                                            labelFill: '#ffae00',
                                            withShape: false,
                                        },
                                        {
                                            yAccessor: ema10.accessor(),
                                            yLabel: `${ema10.type()}(${ema10.options().windowSize})`,
                                            valueFill: '#ff15fc',
                                            labelFill: '#ff15fc',
                                            withShape: false,
                                        },
                                    ]}
                                />
                            )}
                            {/*<LineSeries yAccessor={smaPrice5.accessor()} stroke="#ffae00" />*/}

                            {/* 布林轨道 */}
                            {indicatorMap.boll.isSelected && (
                                <BollingerSeries yAccessor={d => d.bb}
                                                 stroke={bbStroke}
                                                 fill={bbFill} />
                            )}
                            {indicatorMap.boll.isSelected && (
                                <BollingerBandTooltip
                                    origin={[0, 10]}
                                    yAccessor={d => d.bb}
                                    textFill="#8484f4" labelFill="#8484f4"
                                    options={bb.options()} />
                            )}

                            {!subChartHeight && (
                                <XAxis axisAt="bottom" orient="bottom" {...xGrid}/>
                            )}
                        </Chart>

                        {/* ---------成交量-------- */}
                        {indicatorMap.vol.isSelected && (
                            <Chart id={2} origin={(w, h) => [0, h - subChartHeight]} height={subChartHeight}
                                   yExtents={d => d.volume}
                                   padding={{ top: 10, bottom: 0 }}
                            >
                                <XAxis
                                    axisAt="bottom"
                                    orient="bottom"
                                    {...xGrid}
                                />
                                <MouseCoordinateX
                                    at="bottom"
                                    orient="bottom"
                                    rectWidth={120}
                                    displayFormat={timeFormat("%Y-%m-%d %H:%M")} />
                                <MouseCoordinateY
                                    at="left"
                                    orient="left"
                                    displayFormat={format(".4s")} />
                                <BarSeries width={2} yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#51a314" : "#ff0000"} />
                            </Chart>
                        )}

                        {/* ---------MACD-------- */}
                        {indicatorMap.macd.isSelected && (
                            <Chart id={3} height={subChartHeight}
                                yExtents={macdCalculator.accessor()}
                                origin={(w, h) => [0, h - subChartHeight]} padding={{ top: 15, bottom: 0 }}
                                >
                                <XAxis axisAt="bottom" orient="bottom" {...xGrid}/>
                                <YAxis axisAt="right" orient="right" ticks={2}/>

                                <MouseCoordinateX
                                at="bottom"
                                orient="bottom"
                                rectWidth={120}
                                displayFormat={timeFormat("%Y-%m-%d %H:%M")} />
                                <MouseCoordinateY
                                at="left"
                                orient="left"
                                displayFormat={format(".2f")}
                                />

                                <MACDSeries yAccessor={d => d.macd}
                                {...macdAppearance} />
                                <MACDTooltip
                                origin={[0, 15]}
                                yAccessor={d => d.macd}
                                options={macdCalculator.options()}
                                labelFill="#0bb1ff"
                                appearance={macdAppearance}
                                />
                             </Chart>
                        )}

                        {/* ---------RSI-------- */}
                        {indicatorMap.rsi.isSelected && (
                            <Chart id={4}
                                   height={subChartHeight}
                                   yExtents={[0, 100]}
                                   origin={(w, h) => [0, h - subChartHeight]} padding={{ top: 15, bottom: 0 }}
                            >
                                <XAxis axisAt="bottom" orient="bottom" showTicks={true} outerTickSize={0} {...xGrid}/>
                                <YAxis axisAt="right"
                                       orient="right"
                                       tickValues={[30, 50, 70]}/>
                                <MouseCoordinateX
                                    at="bottom"
                                    orient="bottom"
                                    rectWidth={120}
                                    displayFormat={timeFormat("%Y-%m-%d %H:%M")} />
                                <MouseCoordinateY
                                    at="left"
                                    orient="left"
                                    displayFormat={format(".2f")}
                                />

                                <RSISeries yAccessor={d => d.rsi} {...rsiAppearance}/>

                                <RSITooltip origin={[0, 15]}
                                            yAccessor={d => d.rsi}
                                            labelFill="#0bb1ff"
                                            textFill="#ec6bff"
                                            options={rsiCalculator.options()}  {...rsiAppearance}/>
                            </Chart>
                        )}

                        <CrossHairCursor />
                    </ChartCanvas>
                )}
            </div>
        );
    }
}

/*

*/

CandleStickChartPanToLoadMore.propTypes = {
    width: PropTypes.number.isRequired
};

CandleStickChartPanToLoadMore.defaultProps = {
    type: "svg"
};

// CandleStickChartPanToLoadMore = fitWidth(CandleStickChartPanToLoadMore);

export default CandleStickChartPanToLoadMore;
