var Long = require("long")
// 创建ProtoBuf
let ProtoBuf = dcodeIO.ProtoBuf
let protoFile = ProtoBuf.loadProtoFile('resource/QuotModule.proto')
let BizType = protoFile.build('BizType')
let Header = protoFile.build('Header')
let header = new Header()
let TargetPair = protoFile.build('TargetPair')
let targetPair = new TargetPair()
let Request = protoFile.build('Request')
let request = new Request()
let Content = protoFile.build('Content')
let content = new Content()
let QuotMessage = protoFile.build('QuotMessage')
let quotMessage = new QuotMessage()

quotMessage.header = header
quotMessage.content = content
content.request = request

// 创建websocket
function createWebSocket(options) {
  let promise = new Promise(function(resolve, reject) {
    websocket && websocket.close()
    let websocket = options.websocket = new WebSocket(process.env.QUAT_API)
    websocket.binaryType = 'arraybuffer'
    // 连接成功建立的回调方法
    websocket.onopen = function() {
      options.isConnected = true
      resolve()
    }
    // 连接关闭的回调方法
    websocket.onerror = function(error) {
      console.log(error)
    }
    // 连接关闭的回调方法
    websocket.onclose = function() {
      console.log('连接关闭')
    }
  })
  return promise
}


// 根据主币CODE实时行情订阅
let mcqObj = {
    websocket: null,
    isConnected: false
}
export function getMarketCoinQuot(para, callback) {
  if (mcqObj.isConnected) {
    run()
  } else {
    createWebSocket(mcqObj).then(function() {
      run()
    })
  }
  function run() {
    let code = para.code
    header.bizType = BizType.RealTimeQuotByMainCoinCodeSubBiz // 1
    let Business = protoFile.build('RealTimeQuotByMainCoinCodeReq') // 2
    let business = new Business()
    business.mainCoinCode = code // 3
    request.realTimeQuotByMainCoinCodeReq = business // 4

    mcqObj.websocket.send(quotMessage.toArrayBuffer())
    // 接收到消息的回调方法
    mcqObj.websocket.onmessage = function(res) {
      // console.log(QuotMessage.decode(res.data))
      let data = QuotMessage.decode(res.data).content.response.realTimeQuotResp.realTimeQuots
      callback && callback(data)
    }
  }
}

// 根据标的对列表实时行情请求
let tpqObj = {
    websocket: null,
    isConnected: false
}
export function getTargetPairsQuot(para, callback) {
    if (tpqObj.isConnected) {
        run()
    } else {
        createWebSocket(tpqObj).then(function() {
            run()
        })
    }
    function run() {
        if(tpqObj.websocket.readyState !== 1) {
            return
        }
        header.bizType = para.isOnce ? BizType.RealTimeQuotByTargetPairsReqBiz : BizType.RealTimeQuotByTargetPairsSubBiz // 1
        let Business = protoFile.build('RealTimeQuotByTargetPairsReq') // 2
        let business = new Business()
        business.targetPairs = para.targetPairs // 3
        request.realTimeQuotByTargetPairsReq = business // 4

        tpqObj.websocket.send(quotMessage.toArrayBuffer())
        // 接收到消息的回调方法
        tpqObj.websocket.onmessage = function(res) {
            let data = QuotMessage.decode(res.data).content.response.realTimeQuotResp.realTimeQuots
            callback && callback(data)
        }
    }
}

// 币种列表BTC实时价格查询, 将每一个币种的加个转化为btc的价格。
let priceBtcObj = {
    websocket: null,
    isConnected: false
}
export function getPriceBtcQuot(codeList, callback) {
    if (priceBtcObj.isConnected) {
        run()
    } else {
        createWebSocket(priceBtcObj).then(function() {
            run()
        })
    }
    function run() {
        header.bizType = BizType.priceBtcByCoinListReqBiz // 1
        let Business = protoFile.build('RealTimePriceReq') // 2
        let business = new Business()
        business.coinCode = codeList // 3
        request.realTimePriceReq = business // 4

        priceBtcObj.websocket.send(quotMessage.toArrayBuffer())
        // 接收到消息的回调方法
        priceBtcObj.websocket.onmessage = function(res) {
            let data = QuotMessage.decode(res.data).content.response.realTimePriceResp.priceData
            callback && callback(data)
        }
    }
}

let count = 0 //test
function parseData(d) {
    const obj = {}
    obj.date = new Date(parseInt(new Long(d.endTime.low, d.endTime.high, d.endTime.unsigned).toString()));
    obj.open = +d.start;
    obj.high = +d.highest;
    obj.low = +d.lowest;
    obj.close = +d.end;
    obj.volume = +d.quantitiy;


    // const obj = {}
    // obj.date = new Date(parseInt(new Long(d.endTime.low, d.endTime.high, d.endTime.unsigned).toString()));
    //
    // if(count%5 === 1) {
    //     obj.open = +d.start + count%10*500;
    //     obj.close = +d.end - count%10*500*(Math.random());
    //     obj.high = +d.highest + count%10*900*(Math.random());
    //     obj.low = +d.lowest - count%10*800*(Math.random());
    // } else if(count%5 === 2) {
    //     obj.open = +d.start - count%10*200;
    //     obj.close = +d.end - count%30*500*(Math.random()/3);
    //     obj.high = +d.highest + count%30*500*(Math.random());
    //     obj.low = +d.lowest - count%10*800*(Math.random());
    // } else if(count%5 === 3) {
    //     obj.open = +d.start + count%10*900;
    //     obj.close = +d.end + count%40*500*(Math.random());
    //     obj.high = +d.highest + count%40*900*(Math.random());
    //     obj.low = +d.lowest - count%10*1000*(Math.random());
    // } else if(count%5 === 4) {
    //     obj.open = +d.start - count%10*200;
    //     obj.close = +d.end - count%6*500*(Math.random());
    //     obj.high = +d.highest + count%6*500*(Math.random());
    //     obj.low = +d.lowest - count%10*800*(Math.random());
    // } else {
    //     obj.open = +d.start - count%10*400;
    //     obj.close = +d.end + count%80*500*(Math.random()/8)*(Math.random())*3;
    //     obj.high = +d.highest + count%80*500*(Math.random());
    //     obj.low = +d.lowest - count%10*900*(Math.random());
    // }
    //
    // obj.volume = +d.quantitiy + count%6*100;

    count++

    return obj;
}
// 分时行情订阅
let intervalQuotObj = {
    websocket: null,
    isConnected: false
}
export function getIntervalQuot(para, callback) {
    if (intervalQuotObj.isConnected) {
        // run()
        intervalQuotObj.isConnected = false
        intervalQuotObj.websocket.close()
        intervalQuotObj.websocket = null
        createWebSocket(intervalQuotObj).then(function() {
            run()
        })
    } else {
        createWebSocket(intervalQuotObj).then(function() {
            run()
        })
    }
    function run() {
        header.bizType = BizType.IntervalQuotSubBiz // 1
        // let Business = protoFile.build('IntervalQuotSub') // 2
        // let business = new Business()
        // business = para // 3
        request.intervalQuotSub = para // 4

        intervalQuotObj.websocket.send(quotMessage.toArrayBuffer())
        // 接收到消息的回调方法

        intervalQuotObj.websocket.onmessage = function(res) {
            let data = QuotMessage.decode(res.data).content.response.intervalQuotResp.data
            data = data.reverse().map(item => {
                return parseData(item)
            })
            callback && callback(data)
        }
    }
}

// 分时行情请求
let intervalReqObj = {
    websocket: null,
    isConnected: false
}
export function getIntervalReq(para, callback) {
    if (intervalReqObj.isConnected) {
        run()
    } else {
        createWebSocket(intervalReqObj).then(function() {
            run()
        })
    }
    function run() {
        if(intervalReqObj.websocket.readyState !== 1) {
            return
        }
        header.bizType = BizType.IntervalQuotReqBiz // 1
        // let Business = protoFile.build('IntervalQuotSub') // 2
        // let business = new Business()
        // business = para // 3
        request.intervalQuotReq = para // 4
        intervalReqObj.websocket.send(quotMessage.toArrayBuffer())

        intervalReqObj.websocket.onmessage = function(res) {
            let data = QuotMessage.decode(res.data).content.response.intervalQuotResp.data
            data = data.reverse().map(item => {
                return parseData(item)
            })
            callback && callback(data)
        }
    }
}

// 委托订阅
let entrustOrderObj = {
    websocket: null,
    isConnected: false
}
export function entrustOrderSub(para, callback) {
    let obj = entrustOrderObj
    if (obj.isConnected) {
        run()
    } else {
        createWebSocket(obj).then(function() {
            run()
        })
    }
    function run() {
        if(obj.websocket.readyState !== 1) {
            return
        }
        header.bizType = BizType.CommissionSubBiz // 1
        // let Business = protoFile.build('CommissionReq') // 2
        // let business = new Business()
        // business = para // 3
        request.commissionReq = para // 4
        obj.websocket.send(quotMessage.toArrayBuffer())

        obj.websocket.onmessage = function(res) {
            let data = QuotMessage.decode(res.data).content.response.commissionResp
            callback && callback(data)
        }
    }
}

// 订阅最新成交
let latestDealObj = {
    websocket: null,
    isConnected: false
}
export function latestDealSub(targetPair, callback) {
    let obj = latestDealObj
    if (obj.isConnected) {
        run()
    } else {
        createWebSocket(obj).then(function() {
            run()
        })
    }
    function run() {
        if(obj.websocket.readyState !== 1) {
            return
        }
        header.bizType = BizType.LatestDealQuotSubBiz // 1
        let Business = protoFile.build('LatestDealQuotReq') // 2
        let business = new Business()
        business.orderQuantity = 20
        business.targetPair = targetPair // 3
        request.latestDealQuotReq = business // 4
        obj.websocket.send(quotMessage.toArrayBuffer())

        obj.websocket.onmessage = function(res) {
            let data = QuotMessage.decode(res.data).content.response.latestDealQuotResp.data
            callback && callback(data)
        }
    }
}