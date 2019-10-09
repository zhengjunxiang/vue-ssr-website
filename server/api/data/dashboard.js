var Mock = require('mockjs');

// percent: () => Mock.mock('@float(50, 100, 2, 2)') + '%',

// 1、实时算力、24小时算力
var dashboardHash = function() {
  return Mock.mock({
    "hsNow": () => Mock.mock('@float(50, 59, 2, 2)') + '',
    "hsNowUnit": 'MH/s',
    "hsLast1D": () => Mock.mock('@float(50, 59, 2, 2)') + '',
    "hsLast1DUnit": "GH/s",
  })
};

// 2、展示掉线矿工、正常运行矿工、矿工总数
var dashboardWorkerNum = function() {
  return Mock.mock({
    "totalWorkerNum": () => Mock.mock('@integer(50, 59)') + '',
    "onlineWorkerNum": () => Mock.mock('@integer(50, 100)') + '',
    "offlineWorkerNum": () => Mock.mock('@integer(50, 100)') + '',
  })
};

// 3、算力曲线
var dashboardGraph = function() {
  return Mock.mock({
    "items|5-10": [{
      "hashRate": () => Mock.mock('@float(50, 100, 2, 2)'),
      "hashRateUnit|1": ["H/s", "MH/s"],
      "timestamp|1556271301168-1555492274271": 1,
    }]
  })
};

// 4、挖矿信息
var dashboardMinerInfo = function() {
  return Mock.mock({
    "coin": "BTC",
    "payMethods": [
      {"payMethod": "PPS+", "percent": 0.98, "percentStr": "2.5%"},
      {"payMethod": "PPLNS", "percent": 0.98, "percentStr": "2.5%"},
      {"payMethod": "SOLO", "percent": 0.98, "percentStr": "2.5%"}
    ],
    "miniPayment": "0.05"
  })
};

// 5、用户收益
var dashboardEarnings= function() {
  return Mock.mock({
    coin: 'BTC',
    "earningsYesterday": () => Mock.mock('@float(50, 100, 2, 2)') + '',
    "earningsNoPay": () => Mock.mock('@float(50, 100, 2, 2)') + '',
    "earningsTotal": () => Mock.mock('@float(50, 100, 2, 2)') + '',
    "startTime|1556271301168-1555492274271": 1,
    "endTime|1556271301168-1555492274271": 1,
    "effectiveHash": () => Mock.mock('@float(50, 100, 2, 2)') + '',
    "effectiveHashUnit|1": ["H/s", "MH/s"],
    "earningsOfUnit": () => Mock.mock('@float(50, 100, 8, 8)') + '',
    "earningsUnit|1": ["H/s", "MH/s"],
  })
};

function returnData(fn, id) {
  return {
    "code": "000000",
    "data": fn ? fn(id) : '',
    "msg": ''
  };
}

exports.returnData = () => returnData(returnData)
exports.dashboardHash = () => returnData(dashboardHash)
exports.dashboardWorkerNum = () => returnData(dashboardWorkerNum)
exports.dashboardGraph = () => returnData(dashboardGraph)
exports.dashboardMinerInfo = () => returnData(dashboardMinerInfo)
exports.dashboardEarnings = () => returnData(dashboardEarnings)
