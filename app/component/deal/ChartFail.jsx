import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

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

import { discontinuousTimeScaleProvider, discontinuousTimeScaleProviderBuilder } from "react-stockcharts/lib/scale";
import {
    OHLCTooltip,
    MovingAverageTooltip,
    MACDTooltip
} from "react-stockcharts/lib/tooltip";
import { ema, sma, macd } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

import { getIntervalQuot, getIntervalReq } from '@/api/quot'

function getMaxUndefined(calculators) {
    return calculators
        .map(each => each.undefinedLength())
        .reduce((a, b) => Math.max(a, b));
}
const LENGTH_TO_SHOW = 200;

const macdAppearance = {
    stroke: {
        macd: "#FF0000",
        signal: "#00F300"
    },
    fill: {
        divergence: "#4682B4"
    }
};

const para = {
    targetPair: {
        mainCoinCode: 'USDT',
        targetCoinCode: 'BTC'
    },
    interval: '1m',
    number: 200
}
let loadMorePara = Object.assign({latestTime: 0}, para, {number: 200})

const displayTexts = {
    d: "",
    o: "   开: ",
    h: "   高: ",
    l: "   低: ",
    c: "   收: ",
    v: "   量: ",
    na: " n/a "
}

class LineAndScatterChartGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: []
        }

    }

    componentDidMount() {
        getIntervalQuot(para, data => {
            const originData = this.state.data
            let inputData
            if(!originData.length) {
                inputData = data
            } else if(data[data.length -1].date.getTime() !== this.state.data[this.state.data.length - 1].date.getTime()) {
                inputData = originData.concat([data[data.length - 1]])
            }
            // else {
            //     inputData = originData.concat([data[data.length - 1]])
            // }

            if(!inputData) {
                return
            }

            // const ema26 = ema()
            //     .id(0)
            //     .options({ windowSize: 26 })
            //     .merge((d, c) => {
            //         d.ema26 = c;
            //     })
            //     .accessor(d => d.ema26);
            //
            // const ema12 = ema()
            //     .id(1)
            //     .options({ windowSize: 12 })
            //     .merge((d, c) => {
            //         d.ema12 = c;
            //     })
            //     .accessor(d => d.ema12);
            //
            // const macdCalculator = macd()
            //     .options({
            //         fast: 12,
            //         slow: 26,
            //         signal: 9
            //     })
            //     .merge((d, c) => {
            //         d.macd = c;
            //     })
            //     .accessor(d => d.macd);

            const smaVolume5 = sma()
                .id(3)
                .options({
                    windowSize: 5,
                    sourcePath: "volume"
                })
                .merge((d, c) => {
                    d.smaVolume5 = c;
                })
                .accessor(d => d.smaVolume5);

            const maxWindowSize = getMaxUndefined([
                // ema26,
                // ema12,
                // macdCalculator,
                smaVolume5
            ]);
            /* SERVER - START */
            const dataToCalculate = inputData.slice(-LENGTH_TO_SHOW - maxWindowSize);

            // const calculatedData = ema26(
            //     ema12(macdCalculator(smaVolume5(dataToCalculate)))
            const calculatedData = smaVolume5(dataToCalculate)

            const indexCalculator = discontinuousTimeScaleProviderBuilder().indexCalculator();

            // console.log(inputData.length, dataToCalculate.length, maxWindowSize)
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
            } = xScaleProvider(calculatedData.slice(-LENGTH_TO_SHOW));

            // console.log(head(linearData), last(linearData))
            // console.log(linearData.length)

            const state = {
                // ema26,
                // ema12,
                // macdCalculator,
                smaVolume5,
                linearData,
                data: linearData,
                xScale,
                xAccessor,
                displayXAccessor,
                initialIndex: this.state.initialIndex || 0
            }
            this.setState(state)
            

            // const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
            // // const xScaleProvider = discontinuousTimeScaleProvider
            //
            // // const xScaleProvider = discontinuousTimeScaleProviderBuilder()
            // //     .initialIndex(-59)
            //     // .withIndex(originData);
            //
            // const {
            //     data: linearData,
            //     xScale,
            //     xAccessor,
            //     displayXAccessor,
            // } = xScaleProvider(newData);
            //
            // let state
            // if(!originData.length) {
            //     state = {
            //         data: linearData,
            //         xScale,
            //         xAccessor,
            //         displayXAccessor
            //     }
            // } else { // 非初始化情况下不能再变动坐标
            //     state = {
            //         data: linearData
            //         // xScale: this.state.xScale,
            //         // xAccessor: this.state.xAccessor,
            //         // displayXAccessor: this.state.displayXAccessor
            //     }
            // }

            // state = {
            //     data: linearData,
            //     xScale,
            //     xAccessor,
            //     displayXAccessor
            // }
            // this.setState(state)
        })
    }

    saveCanvas(node) {
        this.canvas = node
    }

    onLoadMore(start, end) {
        loadMorePara.latestTime = this.state.data[0].date.getTime()
        getIntervalReq(loadMorePara, data => {
            if (Math.ceil(start) === end) return;
            // console.log("rows to download", rowsToDownload, start, end)
            const {
                data: prevData,
                // ema26,
                // ema12,
                // macdCalculator,
                smaVolume5
            } = this.state;

            const inputData = data.concat(prevData)
            // const { data: inputData } = this.props;
            //
            //
            // if (inputData.length === prevData.length) return;

            const rowsToDownload = end - Math.ceil(start);

            const maxWindowSize = getMaxUndefined([
                // ema26,
                // ema12,
                // macdCalculator,
                smaVolume5
            ]);

            /* SERVER - START */
            // const dataToCalculate = inputData.slice(
            //     -rowsToDownload - maxWindowSize - prevData.length,
            //     -prevData.length
            // );
            const dataToCalculate = inputData.slice(
                -rowsToDownload - maxWindowSize - prevData.length,
                -prevData.length
            );

            // const calculatedData = ema26(
            //     ema12(macdCalculator(smaVolume5(dataToCalculate)))
            // );
            const calculatedData = smaVolume5(dataToCalculate);
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

    render() {
        const height = 430;
        // const height = 580;
        const { width, ratio } = this.props;
        const margin = { left: 40, right: 70, top: 40, bottom: 30 };
        const gridHeight = height - margin.top - margin.bottom;
        const gridWidth = width - margin.left - margin.right;

        const showGrid = true;
        // 横线
        const yGrid = showGrid ? {
            innerTickSize: -1 * gridWidth,
            stroke: 'rgba(0, 0, 0, .1)', // 图表轴线的颜色
            tickStroke: '#111111', //坐标线与坐标值颜色
            tickStrokeOpacity: 0.1,
        } : {};
        // 竖线
        const xGrid = showGrid ? {
            innerTickSize: -1 * gridHeight,
            tickStrokeOpacity: 0,
            stroke: 'rgba(0, 0, 0, .1)'
        } : {};

        const {
            data,
            // ema26,
            // ema12,
            // macdCalculator,
            smaVolume5,
            xScale,
            xAccessor,
            displayXAccessor
        } = this.state;

        return (
            <div className="chart-wrap">
                <div className="coin-select-wrap">BTC/USDT</div>
                {data.length > 1 && (
                    <ChartCanvas height={height}
                                 ratio={ratio}
                                 width={width}
                                 margin={margin}
                                 seriesName="MSFT"
                                 data={data}
                                 xScale={xScale}
                                 xAccessor={xAccessor}
                                 displayXAccessor={displayXAccessor}
                                 // xExtents={xExtents} // 设置数据展示的范围
                                 zoomEvent={false} //禁用缩放功能
                                 // panEvent={false} // 禁用鼠标拖动功能
                                 onLoadMore={this.onLoadMore.bind(this)}
                                 // disableInteraction={true}
                                 ref={node => {
                                     this.saveCanvas(node);
                                 }}
                    >
                        <Chart id={1}
                               height={300}
                               // yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
                               yExtents={[d => [d.high, d.low], smaVolume5.accessor()]}
                               padding={10}
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
                                displayFormat={format(".2f")} />

                            {/*<CandlestickSeries />*/}
                            {/*<LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} />*/}
                            {/*<LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} />*/}
                            <LineSeries yAccessor={smaVolume5.accessor()} stroke={smaVolume5.stroke()} />
                            <LineSeries
                                yAccessor={d => d.close}
                                stroke="#0bb1ff"
                            />
                            {/*<CurrentCoordinate*/}
                                {/*yAccessor={ema26.accessor()}*/}
                                {/*fill={ema26.stroke()}*/}
                            {/*/>*/}
                            {/*<CurrentCoordinate*/}
                                {/*yAccessor={ema12.accessor()}*/}
                                {/*fill={ema12.stroke()}*/}
                            {/*/>*/}
                            <OHLCTooltip origin={[0, -25]} xDisplayFormat={timeFormat("%Y-%m-%d %H:%M")} displayTexts={displayTexts}/>
                        </Chart>

                        <Chart id={2} origin={(w, h) => [0, h - 40]} height={40} yExtents={d => d.volume}>
                            <XAxis
                                axisAt="bottom"
                                orient="bottom"
                                {...xGrid}
                            />
                            <MouseCoordinateX
                                at="bottom"
                                orient="bottom"
                                displayFormat={timeFormat("%Y-%m-%d %H:%M")} />
                            <MouseCoordinateY
                                at="left"
                                orient="left"
                                displayFormat={format(".4s")} />
                            <BarSeries width={2} yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "red"} />
                        </Chart>

                        <CrossHairCursor />
                    </ChartCanvas>
                )}
            </div>

        );
    }
}

LineAndScatterChartGrid.propTypes = {
    width: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    // type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

LineAndScatterChartGrid.defaultProps = {
    // type: "hybrid",
    // seriesType: 'line'
};
LineAndScatterChartGrid = fitWidth(LineAndScatterChartGrid);

export default LineAndScatterChartGrid;
