var Mock = require('mockjs');

// percent: () => Mock.mock('@float(50, 100, 2, 2)') + '%',

// 查看矿工列表
var workerQuery = function() {
  return Mock.mock({
    "items|10-20": [{
      "hsLast1D": () => Mock.mock('@float(50, 100, 2, 2)') + ' H/s',
      "hsLast1H": () => Mock.mock('@float(50, 100, 2, 2)') + ' H/s',
      "rejectRatio": () => Mock.mock('@float(50, 100, 2, 2)') + '%',
      "shareLastTime|1556271301168-1555492274271": 1,
      "workerStatus|1-3": 1,
      "workerId|1-100": 1,
      "id": () => Mock.mock('@id'),
      //"userWorkerId": () => Mock.mock('@id')
      "userWorkerId|1": ['nhando1977.MaryR4R10','newrule001_a-zA-Z0-9@+a-zA-Z0-9@a-zA-Z000']
    }],
    "pageNum":1,
    "pageSize|1": [40, 60, 80],
    "totalPage|100-1000": 1,
    "totalRecord|100-1000": 1
  })
};

// 矿工曲线图
var workerGraph = function() {
  return Mock.mock({
    "items|10-20": [{
      "hashRate": () => Mock.mock('@float(10, 300, 2, 2)'),
      "hashRateUnit|1": ['H/s'],
      "createTime|1555088400000-1565088400000": 1,
    }]
  })
};

// 查看矿工分组列表
var workerGroup = function() {
  const arr = Mock.mock({
    "items|10-20": [{
      "createTime|1554412931000-1564412931000": 1,
      "groupName": () => Mock.mock('@string()'),
      "id": () => Mock.mock('@id'),
      "isDefault|0-1": 1,
      "updateTime|1554412931000-1564412931000": 1,
      "userOid|0-1": 1,
      "workerNum": () => Mock.mock('@integer(60, 100)')
    }]
  })
  arr.items[0].groupName = '全部';
  arr.items[0].id = -2;
  arr.items[1].groupName = '默认组';
  arr.items[1].id = -1;
  return arr;
};

// 查看分组状态信息
var userWorkerSummary = function (groupId) {
  return Mock.mock({
    "disableWorkerNum|1-100": 1,
    "groupId": groupId-0 || -1,
    "id": -1,
    "offlineWorkerNum|1-100": 1,
    "onlineWorkerNum|1-100": 1,
    "totalHash": () => Mock.mock('@float(50, 100, 2, 2)'),
    "totalWorkerNum|1-100": 1,
    "unit|1": ["H/s"]
  })
};

// 矿工总曲线图
var workerAllGraph = function () {
  return Mock.mock({
    "hashRateUnit": "H/s",
    "timestamps|20": [() => Mock.mock('@integer(1554412931000, 1564412931000)')],
    "items|5-10": [{
      "userWorkerId": () => Mock.mock('@string()'),
      "points|20": [() => Mock.mock('@float(1, 1, 2, 2)'), 2.13]
    }]
  })
}

// 判断是否显示小白提醒页面
var workerRemind = function() {
  return Mock.mock({
    "data|1": [0],
  }).data
};

// 查看矿工掉线提醒
var workerWarnQuery = function() {
  const arr = Mock.mock({
    "switcher|1": [true, false],
    "items|0-3": [{
      "id|0-3":3,
      "name": () => Mock.mock('@string()'),
      "contact|1": ['13041113565', 'dawang.w@163.com', '18041111111']
    }]
  })
  return arr;
};
var workerWarnAddSave = function() {
  const arr = Mock.mock({
    "items": []
  })
  return arr;
};
var workerWarnListDel = function() {
  const arr = Mock.mock({
    "items": []
  })
  return arr;
};
var workerWarnSwitcher = function() {
  const arr = Mock.mock({
    "items": []
  })
  return arr;
};
var workerWarnBtnShow = function() {
  const arr = Mock.mock({
    "data|1": [true, false]
  })
  return arr;
}
function returnData(fn, id) {
  if (fn) {
    return {
      "code": "000000",
      "data": fn ? fn(id) : 1,
      "msg": ''
    };
  }
  return {
    "code": "000000",
    "msg": ''
  };
  
}

exports.returnData = () => returnData()
exports.workerQuery = () => returnData(workerQuery)
exports.workerGraph = () => returnData(workerGraph)
exports.workerGroup = () => returnData(workerGroup)
exports.userWorkerSummary = groupId => returnData(() => userWorkerSummary(groupId) )
exports.workerRemind = () => returnData(workerRemind)
exports.workerAllGraph = () => returnData(workerAllGraph)
exports.workerWarnQuery = () => returnData(workerWarnQuery)
exports.workerWarnSwitcher = () => returnData(workerWarnSwitcher)
exports.workerWarnListDel = () => returnData(workerWarnListDel)
exports.workerWarnAddSave = () => returnData(workerWarnAddSave)
exports.workerWarnBtnShow = () => returnData(workerWarnBtnShow)

