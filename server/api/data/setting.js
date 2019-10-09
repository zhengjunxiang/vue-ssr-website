var Mock = require('mockjs');

// 子账户列表
// 回收站子账户列表
var setAccountQuery = function() {
  return Mock.mock({
    "items|2-6":[{
      "id": () => Mock.mock('@id'),
      "userId": () => Mock.mock('@string'),
      "emailFrom|1": ['', '', '', 'wade', 'james'],
      "remark|1": [() => Mock.mock('@string'), ''],
    }],
    "pageNum": 1,
    "pageSize": 1,
    "totalPage": 1,
    "total|1-100": 1
  })
};

// 获取当前时区
var setAccountTimezoneQuery = function() {
  return Mock.mock({
    "timeZone|1": ['TIME_ZONE_M1', 'TIME_ZONE_0', 'TIME_ZONE_M2']
  }).timeZone;
};

// 子账户配置列表
var setAccountSettingQuery = function() {
  return Mock.mock({
    "items|5-12":[{
      "id": () => Mock.mock('@id'),
      "coinType|1": ["BTC", "BCH", "BTM", "LTC"], 
      "miniPayment|1": ['0.1', '0.01'],
      "miniPaymentSystem": 0.01,
      "payMethod|1": ['PPS+', 'PPS'],
      "payMethodList": ['PPS+', 'PPS'],
      "wallet|1": [() => Mock.mock('@id'), ''],
      "miningCoin|1": ["BTC", "BCH", '', ''],
      "paymentId|1": [() => Mock.mock('@id'), ''],
      "isLocked|0-1": 1,
      "moreList2|0-1": [
        {"mergeType": "MERGE", "coinType": "VCASH"},
        {"mergeType": "CANDY" },
      ]
    }]
  })
};

// 生成观察者连接
var setAccountObserverQuery = function() {
  return Mock.mock({
    "id": () => Mock.mock('@id'),
    "userId": () => Mock.mock('@string'),
    "accessKey": () => Mock.mock('@string'),
    "createTime|1555088400000-1565088400000": 1
  })
};

// 获取合并挖矿钱包地址
var setAccountWalletMergeQuery = function() {
  return Mock.mock({
    "userId": () => Mock.mock('@string'),
    "wallet": () => Mock.mock('@id'),
    "mergeCoin|1": ["NMC", "DOC", "VCASH"]
  })
};

// 获取授权子账户列表
var setAccountShareQuery = function() {
  return Mock.mock({
    "items|2-10":[{
      "createTime|1555088400000-1565088400000": 1,
      "id": () => Mock.mock('@id'),
      "emailTo": () => Mock.mock('@email'),
      "emailToRemark": () => Mock.mock('@email')
    }],
    "pageNum": 1,
    "pageSize": 1,
    "totalPage": 1,
    "total|1-100": 1
  })
};

// 删除授权子账户
// 新增授权子账户
// 合并挖矿钱包地址设置
// 停止分享观察者连接
// 子账户钱包锁定
// 子账户删除
// 子账户设置
// 切换挖矿币种
// 回收站子账户恢复
// 新增子账户
// 设置当前时区
function returnData(fn, id) {
  return {
    "code": "000000",
    "data": fn ? fn(id) : '',
    "msg": ''
  };
}

// stats
exports.setAccountQuery = () => returnData(setAccountQuery)
exports.setAccountTimezoneQuery = () => returnData(setAccountTimezoneQuery)
exports.setAccountSettingQuery = () => returnData(setAccountSettingQuery)
exports.setAccountObserverQuery = () => returnData(setAccountObserverQuery)
exports.setAccountWalletMergeQuery = () => returnData(setAccountWalletMergeQuery)
exports.setAccountWalletOtherPayQuery = () => returnData(setAccountWalletOtherPayQuery)
exports.setAccountShareQuery = () => returnData(setAccountShareQuery)
