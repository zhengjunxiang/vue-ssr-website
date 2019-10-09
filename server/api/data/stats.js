var Mock = require('mockjs');

// stats
var statsCurrent = function() {
  return Mock.mock({
    "userId|1":['testHua', 'James', 'Wade', 'Lem'],
    // "coinType|1": ["SCC", "BTC", "LTC", "XMC", "DASH"],
    "coinType|1": ["BTC", "LTC"],
    "email": () => Mock.mock('@email'),
  })
};

var statsUserList = function() {
  return Mock.mock({
    "permissionUserModelList|1-7":[{
      "userId": () => Mock.mock('@string'),
      "permission": "dashboard,paymenthistory,worker,email",
      "hashRate": () => Mock.mock('@float(50, 100, 2, 2)'),
      "hashRateUnit": "TH/s"
    },
    {
      "userId": () => Mock.mock('@string'),
      "permission": "dashboard,paymenthistory,worker,email",
      "hashRate": 0,
      "hashRateUnit": "TH/s"
    }],
    "userIdList|4-7":[{
      "hashRate": () => Mock.mock('@float(50, 100, 2, 2)'),
      "hashRateUnit":"H/s",
      "userId":() => Mock.mock('@string'),
      //"userId":"testHua",
      "userWebType":null
    },
    {
      "hashRate": 0,
      "hashRateUnit":"H/s",
      "userId":() => Mock.mock('@string'),
      //"userId":"testHua",
      "userWebType":null
    }/*,
    {
      "hashRate": () => Mock.mock('@float(50, 100, 2, 2)'),
      "hashRateUnit":"H/s",
      //"userId":() => Mock.mock('@string'),
      "userId":"testHua1",
      "userWebType":[-10]
    },{
      "hashRate": () => Mock.mock('@float(50, 100, 2, 2)'),
      "hashRateUnit":"H/s",
      //"userId":() => Mock.mock('@string'),
      "userId":"testHua2",
      "userWebType":[0]
    }*/],
    "needAdd|1":["0"]
  })
};

var statsCoinList = function() {
  return Mock.mock({
    "items": [
      {
        "coinType": "BTC",
        "coinName": "Bitcoin",
        "hashRate": () => Mock.mock('@float(50, 100, 2, 2)') + 'MH/s'
      }, {
        "coinType": "LTC",
        "coinName": "Litecoin",
        "hashRate": () => Mock.mock('@float(50, 100, 2, 2)') + 'MH/s'
      }, {
        "coinType": "ETH",
        "coinName": "Ethereum",
        "hashRate": () => Mock.mock('@float(50, 100, 2, 2)') + 'MH/s'
      }, {
        "coinType": "ETC",
        "coinName": "ETC",
        "hashRate": () => Mock.mock('@float(50, 100, 2, 2)') + 'MH/s'
      }, {
        "coinType": "ZEC",
        "coinName": "Zcash",
        "hashRate": () => Mock.mock('@float(50, 100, 2, 2)') + 'MH/s'
      }, {
        "coinType": "DASH",
        "coinName": "Dash",
        "hashRate": () => Mock.mock('@float(50, 100, 2, 2)') + 'MH/s'
      }, {
        "coinType": "BCH",
        "coinName": "BCH",
        "hashRate": () => Mock.mock('@float(50, 100, 2, 2)') + 'MH/s'
      }, {
        "coinType": "SCC",
        "coinName": "SCC",
        "hashRate": () => Mock.mock('@float(50, 100, 2, 2)') + 'MH/s'
      }, {
        "coinType": "XMC",
        "coinName": "XMC",
        "hashRate": () => Mock.mock('@float(50, 100, 2, 2)') + 'MH/s'
      }, {
        "coinType": "BTM",
        "coinName": "Bytom",
        "hashRate": () => Mock.mock('@float(50, 100, 2, 2)') + 'MH/s'
      }
    ]
  })
};

var authCheck = function() {
  return Mock.mock({
    data: () => Mock.mock('@id')
  }).data
};

var logout = function() {
  return 'https://XXX.com'
};

// 判断是否显示小白提醒页面
var workerRemind = function() {
  return Mock.mock({
    "data|1": [0,0,0,1],
  }).data
};

function returnData(fn, id) {
  return {
    "code": "000000",
    "data": fn ? fn(id) : '',
    "msg": ''
  };
}

// stats
exports.statsCurrent = () => returnData(statsCurrent)
exports.statsUserList = () => returnData(statsUserList)
exports.statsCoinList = () => returnData(statsCoinList)
exports.logout = () => returnData(logout)
exports.workerRemind = () => returnData(workerRemind)
exports.authCheck = () => returnData(authCheck)
