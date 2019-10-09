var Mock = require('mockjs');

// 查看币种列表
var coinListQuery = function() {
  return Mock.mock({
    "items": [
      {
coinType: "BTC",
poolHashrate: "9.16 EH/s",
networkDiff: 9985348008059.555,
blockReward: 12.5,
coinPriceCny: 68015.430168,
coinPriceUsd: 9682.738763,
miningType: [
{
payMethod: "PPLNS",
percent: 1,
percentStr: "0%"
},
{
payMethod: "SOLO",
percent: 0.99,
percentStr: "1%"
},
{
payMethod: "PPS+",
percent: 0.96,
percentStr: "4%"
}
],
minimumPayment: 0.001,
calculateUnit: 1000000000000,
coinUnit: "H/s",
coinCoefficient: 4294967296,
supportAnonymous: false
},
{
coinType: "BCH",
poolHashrate: "160 PH/s",
networkDiff: 304531830433.9564,
blockReward: 12.5,
coinPriceCny: 2065.689697,
coinPriceUsd: 294.073472,
miningType: [
{
payMethod: "PPLNS",
percent: 1,
percentStr: "0%"
},
{
payMethod: "SOLO",
percent: 0.99,
percentStr: "1%"
},
{
payMethod: "PPS+",
percent: 0.96,
percentStr: "4%"
}
],
minimumPayment: 0.001,
calculateUnit: 1000000000000,
coinUnit: "H/s",
coinCoefficient: 4294967296,
supportAnonymous: false
},
{
coinType: "LTC",
poolHashrate: "35.0 TH/s",
networkDiff: 13444380.11958768,
blockReward: 12.5,
coinPriceCny: 515.719991,
coinPriceUsd: 73.418369,
miningType: [
{
payMethod: "PPS",
percent: 0.97,
percentStr: "3%"
},
{
payMethod: "PPLNS",
percent: 1,
percentStr: "0%"
},
{
payMethod: "SOLO",
percent: 0.99,
percentStr: "1%"
}
],
minimumPayment: 0.001,
calculateUnit: 1000000,
coinUnit: "H/s",
coinCoefficient: 4294967296,
supportAnonymous: false
},
{
coinType: "ETH",
poolHashrate: "432 GH/s",
networkDiff: 2332100589080661,
blockReward: 2,
coinPriceCny: 1260.561169,
coinPriceUsd: 179.454639,
miningType: [
{
payMethod: "PPS",
percent: 0.97,
percentStr: "3%"
}
],
minimumPayment: 0.01,
calculateUnit: 1000000,
coinUnit: "H/s",
coinCoefficient: 2147483648,
supportAnonymous: true
},
{
coinType: "ETC",
poolHashrate: "4.01 GH/s",
networkDiff: 133450786060689,
blockReward: 4,
coinPriceCny: 38.437516,
coinPriceUsd: 5.472,
miningType: [
{
payMethod: "PPS",
percent: 0.97,
percentStr: "3%"
}
],
minimumPayment: 0.01,
calculateUnit: 1000000,
coinUnit: "H/s",
coinCoefficient: 2147483648,
supportAnonymous: true
},
{
coinType: "ZEC",
poolHashrate: "686 MSol/s",
networkDiff: 83902403.20680676,
blockReward: 10,
coinPriceCny: 341.422117,
coinPriceUsd: 48.605164,
miningType: [
{
payMethod: "PPS",
percent: 0.95,
percentStr: "5%"
},
{
payMethod: "PPLNS",
percent: 1,
percentStr: "0%"
}
],
minimumPayment: 0.001,
calculateUnit: 1000,
coinUnit: "Sol/s",
coinCoefficient: 8192,
supportAnonymous: true
},
{
coinType: "DASH",
poolHashrate: "953 TH/s",
networkDiff: 194074078.3405662,
blockReward: 1.55331344,
coinPriceCny: 651.808608,
coinPriceUsd: 92.792069,
miningType: [
{
payMethod: "PPLNS",
percent: 1,
percentStr: "0%"
}
],
minimumPayment: 0.001,
calculateUnit: 1000000000,
coinUnit: "H/s",
coinCoefficient: 4294967296,
supportAnonymous: false
},
{
coinType: "SCC",
poolHashrate: "190 TH/s",
networkDiff: 1253591922670443000,
blockReward: 79600,
coinPriceCny: 0.000373,
coinPriceUsd: 0.000053,
miningType: [
{
payMethod: "PPS",
percent: 0.97,
percentStr: "3%"
}
],
minimumPayment: 100,
calculateUnit: 1000000000,
coinUnit: "H/s",
coinCoefficient: 1,
supportAnonymous: false
},
{
coinType: "XMC",
poolHashrate: "314 MH/s",
networkDiff: 41404265135,
blockReward: 2.4262611,
coinPriceCny: 2.801251,
coinPriceUsd: 0.398789,
miningType: [
{
payMethod: "PPS",
percent: 0.97,
percentStr: "3%"
}
],
minimumPayment: 0.1,
calculateUnit: 1000,
coinUnit: "H/s",
coinCoefficient: 1,
supportAnonymous: false
},
{
coinType: "BTM",
poolHashrate: "197 MH/s",
networkDiff: 58652409817,
blockReward: 412.5,
coinPriceCny: 0.538857,
coinPriceUsd: 0.076712,
miningType: [
{
payMethod: "PPS",
percent: 0.97,
percentStr: "3%"
}
],
minimumPayment: 1,
calculateUnit: 1000,
coinUnit: "H/s",
coinCoefficient: 1,
supportAnonymous: false
}
    ]
  })
};
// 查看创新区币种列表
var labCoinListQuery = function() {
  return Mock.mock({
    "items": [/*{
      "blockReward|1-10": 1,
      "coinPriceCny|1-10": 0,
      "coinPriceUsd|10-100": 0,
      "coinType|1": ['HC', "DCR", "RVN", "ETN", "BEAM", "AXE"],
      "calculateUnit|1": [Math.pow(10, 12), Math.pow(10, 9), Math.pow(10, 6)],
      "coinUnit|1": ["H/s", "Sol/s"],
      "coinCoefficient|1": [Math.pow(2, 32), Math.pow(2, 20), Math.pow(2, 16)],
      "feePercent|0.1-2": 1,
      "miningAddr": () => Mock.mock('@id'),
      "miningType|1": ["PPS", "PPS+"],
      "netHashrate|10000-100000": 0,
      "netHashrateUnit|1": ["GH/s", "MH/s"],
      "networkDiff|1000000-100000000": 0,
      "poolHashrate|1000-10000": 0,
      "minimumPayment": Mock.mock('@float(0, 1, 1, 1)'),
      "poolHashrateUnit|1": ["GH/s", "MH/s"]
    }*/
    {
      coinType: "HC",
      poolHashrate: 2.66,
      poolHashrateUnit: "PH/s",
      netHashrate: 43.56,
      netHashrateUnit: "PH/s",
      networkDiff: 1521282235,
      blockReward: 3.77901866,
      coinPriceCny: 19.5101,
      coinPriceUsd: 2.8339,
      miningAddr: "stratum+tcp://hc.XXX.com:9001",
      miningType: "PPS",
      feePercent: 0,
      minimumPayment: 0.5,
      calculateUnit: 1000000000000,
      coinUnit: "H/s",
      coinCoefficient: 4294967296
    },
    {
      coinType: "DERO",
      poolHashrate: 2.66,
      poolHashrateUnit: "PH/s",
      netHashrate: 43.56,
      netHashrateUnit: "PH/s",
      networkDiff: 1521282235,
      blockReward: 3.77901866,
      coinPriceCny: 19.5101,
      coinPriceUsd: 2.8339,
      miningAddr: "stratum+tcp://hc.XXX.com:9001",
      miningType: "PPS",
      feePercent: 0,
      minimumPayment: 0.5,
      calculateUnit: 1000000000000,
      coinUnit: "H/s",
      coinCoefficient: 4294967296
    },
    {
      coinType: "DCR",
      poolHashrate: 74.1,
      poolHashrateUnit: "PH/s",
      netHashrate: 554,
      netHashrateUnit: "PH/s",
      networkDiff: 34838141510,
      blockReward: 10.40606893,
      coinPriceCny: 174.3614,
      coinPriceUsd: 25.3267,
      miningAddr: "stratum+tcp://dcr.XXX.com:9002",
      miningType: "PPS",
      feePercent: 0,
      minimumPayment: 0.1,
      calculateUnit: 1000000000000,
      coinUnit: "H/s",
      coinCoefficient: 4294967296
    },
    {
      coinType: "GRIN29",
      poolHashrate: 10,
      poolHashrateUnit: "g/s",
      netHashrate: 1.15,
      netHashrateUnit: "Mg/s",
      networkDiff: 5542345,
      blockReward: 60,
      coinPriceCny: 13.5262,
      coinPriceUsd: 1.89,
      miningAddr: "stratum+tcp://grin.XXX.com:9016",
      miningType: "PPS",
      feePercent: 0.04,
      minimumPayment: 0.1,
      calculateUnit: 1,
      coinUnit: "g/s",
      coinCoefficient: 21
    },
    {
      coinType: "GRIN31",
      poolHashrate: 0,
      poolHashrateUnit: "g/s",
      netHashrate: 124.77,
      netHashrateUnit: "Kg/s",
      networkDiff: 400002,
      blockReward: 60,
      coinPriceCny: 13.5262,
      coinPriceUsd: 1.89,
      miningAddr: "stratum+tcp://grin.XXX.com:9016",
      miningType: "PPS",
      feePercent: 0.04,
      minimumPayment: 0.1,
      calculateUnit: 1,
      coinUnit: "g/s",
      coinCoefficient: 42
    },
    {
      coinType: "DGB_SHA256D",
      poolHashrate: 74.1,
      poolHashrateUnit: "GH/s",
      netHashrate: 554,
      netHashrateUnit: "GH/s",
      networkDiff: 34838141510,
      blockReward: 10.40606893,
      coinPriceCny: 174.3614,
      coinPriceUsd: 25.3267,
      miningAddr: "stratum+tcp://dcr.XXX.com:9002",
      miningType: "PPS",
      feePercent: 0,
      minimumPayment: 0.1,
      calculateUnit: 1000000000,
      coinUnit: "H/s",
      coinCoefficient: 4294967296
    },
    {
      coinType: "DGB_SCRYPT",
      poolHashrate: 44.1,
      poolHashrateUnit: "GH/s",
      netHashrate: 55,
      netHashrateUnit: "GH/s",
      networkDiff: 34838141511,
      blockReward: 10.40606893,
      coinPriceCny: 171.3614,
      coinPriceUsd: 20.3267,
      miningAddr: "stratum+tcp://dcr.XXX.com:9002",
      miningType: "PPS",
      feePercent: 0,
      minimumPayment: 0.1,
      calculateUnit: 1000000000,
      coinUnit: "H/s",
      coinCoefficient: 4294967296
    }]
  })
};
// 查看币种详情
var coinDetailQuery = function() {
  return Mock.mock({
    "coinType|1": ["BTC", "ETH", "ETC", "BCH", "LTC"],
    "mergeRate|1-10": 2,
    "algorithm|1":["SHA256d", "SHA256d"],
    "payMethods": [
      {
        "payMethod": "PPLNS",
        "percent": 0,
        "percentStr": "0%"
      },
      {
          "payMethod":"SOLO",
          "percent":0.99,
          "percentStr":"1%"
      },
      {
          "payMethod":"PPS+",
          "percent":0.96,
          "percentStr":"4%"
      }
    ]
  })
};

// 查看公告列表
var newsQuery = function() {
  return Mock.mock({
    "items": [{
      "id": 177,
      "title": "xxx关于创新区ETN支付用户余额公告"
    }, {
      "id": 175,
      "title": "xxx关于Zcash恢复打款公告"
    }, {
      "id": 173,
      "title": "xxx关于Zcash硬分叉暂停打款公告"
    }]
  })
};
// 算力曲线图
var hashGraph = function() {
  return Mock.mock({
    "items|0-20": [{
      "hashRate": () => Mock.mock('@float(10, 300, 2, 2)'),
      "hashRateUnit|1": ['H/s'],
      "timestamp|1556271301168-1555492274271": 1
    }]
  })
};

// lucky曲线图
var luckyGraph = function() {
  return Mock.mock({
    "items|0-20": [{
      "lucky": () => Mock.mock('@float(10, 300, 2, 2)'),
      "timestamp|1556271301168-1555492274271": 1
    }]
  })
};

var walletAddrVal = function() {
  return Mock.mock({
    "miningAddress": true,
    "walletAddress": Mock.mock('@guid()')
  })
};

var PPLNSReward = function() {
  return Mock.mock({
    "avgBlockReward":"12",
    "ppsPercent":"5%",
    "ppsReward":"10"
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
exports.coinListQuery = () => returnData(coinListQuery)
exports.coinDetailQuery = () => returnData(coinDetailQuery)
exports.hashGraph = () => returnData(hashGraph)
exports.luckyGraph = () => returnData(luckyGraph)
exports.newsQuery = () => returnData(newsQuery)
exports.walletAddrVal = () => returnData(walletAddrVal)
exports.PPLNSReward = () => returnData(PPLNSReward)
exports.labCoinListQuery = () => returnData(labCoinListQuery)



