var Mock = require('mockjs');

// percent: () => Mock.mock('@float(50, 100, 2, 2)') + '%',

// 1、收益列表
var recvAndPayRecv = function() {
  return Mock.mock({
    "items|10-20":[
      {
        "creatDate|1556271301168-1555492274271": 1,
        "dayHashRate":() => Mock.mock('@float(50, 100, 2, 2)'),
        "dayHashRateUnit|1": ["H/s", "MH/s"],
        "dayRecv": () => Mock.mock('@float(50, 100, 8, 8)'),
        "payStatus|1": ['PAID', 'NOTPAID'],
        "plusPercent|1": [() => Mock.mock('@float(0, 0, 2, 2)'), '0.00000000'],
        "type|1": ['PPS_PLUS', 'SOLO', 'REFUND'],
      }
    ],
    "totalRecv": () => Mock.mock('@float(50, 500, 8, 8)') + '',
    "totalRecord": () => Mock.mock('@integer(50, 500)'),
  })
};

// 2、支付列表
var recvAndPayPay = function() {
  return Mock.mock({
    "items|10-20":[
      {
        "amount": () => Mock.mock('@float(50, 100, 6, 6)'),
        "creatDate|1556271301168-1555492274271": 1,
        "payId": () => Mock.mock('@id'),
        "transactionHash|1": [() => Mock.mock('@id'), null],
        "walletAddress": () => Mock.mock('@id'),
      }
    ],
    "totalRecv": () => Mock.mock('@integer(50, 500)'),
    "totalRecord": () => Mock.mock('@integer(50, 500)'),
  })
};

// 3、支付对应的收益下拉列表
var recvAndPayPayRecv = function() {
  return Mock.mock({
    "items|2-5": [{
      "creatDate|1556271301168-1555492274271": 1,
      "dayHashRate": () => Mock.mock('@float(50, 100, 2, 2)'),
      "dayHashRateUnit|1": ["H/s", "MH/s"],
      "dayRecv": () => Mock.mock('@float(50, 100, 2, 2)'),
      "payStatus|1": ['PAID', 'NOTPAID'],
      "type|1": ['PPS_PLUS', 'SOLO', 'REFUND'],
    }]
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
exports.recvAndPayRecv = () => returnData(recvAndPayRecv)
exports.recvAndPayPay = () => returnData(recvAndPayPay)
exports.recvAndPayPayRecv = () => returnData(recvAndPayPayRecv)
