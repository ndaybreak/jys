import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import CoinList from './CoinList';

import React from "react";
import PropTypes from "prop-types";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
    BarSeries,
    AreaSeries,
    CandlestickSeries,
    LineSeries,
    MACDSeries
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
    GroupTooltip
} from "react-stockcharts/lib/tooltip";
import { ema, sma, macd } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";

import { getIntervalQuot, getIntervalReq } from '@/api/quot'
import eventProxy from '@/utils/eventProxy'

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
    number: 150
}
let loadMorePara = Object.assign({latestTime: 0}, PARA, {number: 150})

let timeType = 'time'

class CandleStickChartPanToLoadMore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            suffix: 1
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

        const maxWindowSize = getMaxUndefined([
            ema5,
            ema10,
            macdCalculator,
            smaPrice5
        ]);
        /* SERVER - START */
        // const dataToCalculate = inputData.slice(-inputData.length + 55);
        const dataToCalculate = inputData

        const calculatedData = ema5(
            ema10(macdCalculator(smaPrice5(dataToCalculate)))
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
            initialIndex
        } = this.state;

        const maxWindowSize = getMaxUndefined([
            ema5,
            ema10,
            macdCalculator,
            smaPrice5
        ]);
        /* SERVER - START */
        // const dataToCalculate = newData.slice(
        //     -this.canvas.fullData.length - maxWindowSize
        // );
        const dataToCalculate = newData

        const calculatedData = ema5(
            ema10(macdCalculator(smaPrice5(dataToCalculate)))
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
                smaPrice5
            } = this.state;

            const rowsToDownload = end - Math.ceil(start);

            const maxWindowSize = getMaxUndefined([
                ema5,
                ema10,
                macdCalculator,
                smaPrice5
            ]);

            /* SERVER - START */
            const dataToCalculate = inputData
            //     .slice(
            //     -rowsToDownload - maxWindowSize - prevData.length,
            //     -prevData.length
            // );

            const calculatedData = ema5(
                ema10(macdCalculator(smaPrice5(dataToCalculate)))
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

    toggleCoins() {
        this.setState({
            showCoins: !this.state.showCoins
        })
    }

    changeType(type) {
        timeType = type
        this.loadData()
    }

    fill(d) {
        return d.close > d.open ? "#51a314" : "#ff0000";
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
                divergence: "#4682B4"
            },
        };

        const mouseEdgeAppearance = {
            textFill: "#542605",
            stroke: "#05233B",
            strokeOpacity: 1,
            strokeWidth: 3,
            arrowWidth: 5,
            fill: "#BCDEFA",
        };

        const {
            data,
            ema5,
            ema10,
            macdCalculator,
            smaPrice5,
            xScale,
            xAccessor,
            displayXAccessor
        } = this.state;

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
                    <span className="coin-select" onClick={this.toggleCoins.bind(this)}>{this.state.base}/{this.state.target} <i className={'icon icon-arrow-down icon-coin ' + (this.state.showCoins ? 'icon-arrow-up' : '')}></i></span>
                    <div className={'coin-list-outer ' + (this.state.showCoins ? '' : 'hide')}>
                        <CoinList />
                    </div>
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
                            height={310}
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
                                ticks={5}
                                {...yGrid}
                            />
                            <MouseCoordinateY
                                at="right"
                                orient="right"
                                rectWidth={80}
                                displayFormat={format(".2f")} />

                            {timeType === 'time' && (
                                <LineSeries yAccessor={d => d.close} stroke="#0bb1ff"/>
                            )}

                            {timeType !== 'time' && (
                                <CandlestickSeries className="testing" fill={this.fill.bind(this)} stroke={this.fill.bind(this)}
                                                   wickStroke={this.fill.bind(this)} clip={false}/>
                            )}

                            <LineSeries yAccessor={ema5.accessor()} stroke="#ffae00" />
                            <LineSeries yAccessor={ema10.accessor()} stroke="#ff15fc" />

                            {/*<LineSeries yAccessor={smaPrice5.accessor()} stroke="#ffae00" />*/}

                            <EdgeIndicator
                                itemType="last"
                                orient="right"
                                edgeAt="right"
                                yAccessor={d => d.close}
                                rectWidth={80}
                                fill={d => (d.close > d.open ? "#51a314" : "#FF0000")}
                            />

                            <OHLCTooltip origin={[0, -15]} textFill="#0bb1ff" labelFill="#0bb1ff"/>
                            {/*<MovingAverageTooltip*/}
                                {/*// onClick={(e) => console.log(e)}*/}
                                {/*origin={[0, 15]}*/}
                                {/*textFill ='#ffae00'*/}
                                {/*labelFill = '#ffae00'*/}
                                {/*options={[*/}
                                    {/*// Object.assign({*/}
                                    {/*//     yAccessor: smaPrice5.accessor(),*/}
                                    {/*//     type: smaPrice5.type(),*/}
                                    {/*//     stroke: '#ffae00'*/}
                                    {/*// }, smaPrice5.options()),*/}
                                    {/*Object.assign({*/}
                                        {/*yAccessor: ema5.accessor(),*/}
                                        {/*type: ema5.type(),*/}
                                        {/*stroke: '#ffae00'*/}
                                    {/*}, ema5.options()),*/}
                                    {/*Object.assign({*/}
                                        {/*yAccessor: ema10.accessor(),*/}
                                        {/*type: ema10.type(),*/}
                                        {/*stroke: '#ff15fc',*/}
                                        {/*textFill: '#ff15fc',*/}
                                        {/*labelFill: '#ff15fc'*/}
                                    {/*}, ema10.options())*/}
                                {/*]}*/}
                            {/*/>*/}

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
                        </Chart>
                        <Chart id={2} origin={(w, h) => [0, h - 60]} height={60}
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
                        {/*<Chart id={3} height={80}*/}
                               {/*yExtents={macdCalculator.accessor()}*/}
                               {/*origin={(w, h) => [0, h - 80]} padding={{ top: 10, bottom: 0 }}*/}
                        {/*>*/}
                            {/*<XAxis axisAt="bottom" orient="bottom"/>*/}
                            {/*<YAxis axisAt="right" orient="right" ticks={2} />*/}

                            {/*<MouseCoordinateX*/}
                                {/*at="bottom"*/}
                                {/*orient="bottom"*/}
                                {/*rectWidth={120}*/}
                                {/*displayFormat={timeFormat("%Y-%m-%d %H:%M")} />*/}
                            {/*<MouseCoordinateY*/}
                                {/*at="right"*/}
                                {/*orient="right"*/}
                                {/*displayFormat={format(".2f")}*/}
                                {/*{...mouseEdgeAppearance}*/}
                            {/*/>*/}

                            {/*<MACDSeries yAccessor={d => d.macd}*/}
                                        {/*{...macdAppearance} />*/}
                            {/*<MACDTooltip*/}
                                {/*origin={[-38, 15]}*/}
                                {/*yAccessor={d => d.macd}*/}
                                {/*options={macdCalculator.options()}*/}
                                {/*appearance={macdAppearance}*/}
                            {/*/>*/}
                        {/*</Chart>*/}
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
