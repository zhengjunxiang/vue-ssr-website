/* eslint-disable */
const router = require('koa-router')();
let {
  returnData, workerQuery, 
  workerGraph, workerGroup, 
  userWorkerSummary, 
  workerAllGraph, workerWarnQuery, 
  workerWarnAddSave, workerWarnSwitcher, workerWarnListDel, workerWarnBtnShow
} = require('./data/worker');

let {
  statsUserList, statsCurrent, statsCoinList, logout, workerRemind, authCheck
} = require('./data/stats');

let {
  dashboardHash, dashboardWorkerNum, dashboardGraph, dashboardMinerInfo, dashboardEarnings
} = require('./data/dashboard');

let {
  recvAndPayRecv, recvAndPayPay, recvAndPayPayRecv
} = require('./data/recvAndPay');

let {
  setAccountQuery, setAccountTimezoneQuery, setAccountSettingQuery, setAccountObserverQuery,
  setAccountWalletMergeQuery, setAccountWalletOtherPayQuery, setAccountShareQuery
} = require('./data/setting');

let {
	coinListQuery, coinDetailQuery, hashGraph, luckyGraph, newsQuery, walletAddrVal, PPLNSReward, labCoinListQuery
} = require('./data/home');

// worker
router.get('/api/v3/worker/query', (ctx) => { ctx.response.body = workerQuery() });
router.get('/api/v3/worker/export', (ctx) => { ctx.response.body = workerQuery() });
router.post('/api/v3/worker/disable/delete', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/worker/graph/query', (ctx) => { ctx.response.body = workerGraph() });
router.get('/api/v3/worker/group/query', (ctx) => { ctx.response.body = workerGroup() });
router.post('/api/v3/worker/group/add', (ctx) => { ctx.response.body = returnData() });
router.post('/api/v3/worker/group/delete', (ctx) => { ctx.response.body = returnData() });
router.post('/api/v3/worker/group/move', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/worker/group/summary/query', (ctx) => {
  ctx.response.body = userWorkerSummary(ctx.request.query.groupId)
});
router.get('/api/v3/worker/remind', (ctx) => { ctx.response.body = workerRemind() });
router.get('/api/v3/worker/export', (ctx) => { ctx.response.body = workerQuery() });
router.get('/api/v3/worker/all/graph/query', (ctx) => { ctx.response.body = workerAllGraph() });

//worker warn
router.get('/api/v3/alarm/query', (ctx) => { ctx.response.body = workerWarnQuery() });
router.post('/api/v3/alarm/add', (ctx) => { ctx.response.body = workerWarnAddSave() });
router.get('/api/v3/alarm/delete', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/alarm/switcher', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/alarm/isShow', (ctx) => { ctx.response.body = workerWarnBtnShow() });

// stats
router.get('/api/v3/stats/current', (ctx) => { ctx.response.body = statsCurrent() });
router.get('/api/v3/stats/logout', (ctx) => { ctx.response.body = logout() });
router.get('/api/v3/stats/setCoinType', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/stats/setUser', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/stats/userList', (ctx) => { ctx.response.body = statsUserList() });
router.get('/api/v3/stats/coinTypeList', (ctx) => { ctx.response.body = statsCoinList() });
router.get('/api/v3/stats/init', (ctx) => { ctx.response.body = returnData() });
router.get('/auth/v3/check', (ctx) => { ctx.response.body = authCheck() });

// dashboard
router.get('/api/v3/dashboard/hash/query', (ctx) => { ctx.response.body = dashboardHash() });
router.get('/api/v3/dashboard/workerNum/query', (ctx) => { ctx.response.body = dashboardWorkerNum() });
router.get('/api/v3/dashboard/graph/query', (ctx) => { ctx.response.body = dashboardGraph() });
router.get('/api/v3/pool/mining/info/query', (ctx) => { ctx.response.body = dashboardMinerInfo() });
router.get('/api/v3/dashboard/earnings/query', (ctx) => { ctx.response.body = dashboardEarnings() });

// recvAndPay
router.get('/api/v3/recvAndPay/recv', (ctx) => { ctx.response.body = recvAndPayRecv() });
router.get('/api/v3/recvAndPay/pay', (ctx) => { ctx.response.body = recvAndPayPay() });
router.get('/api/v3/recvAndPay/payRecv', (ctx) => { ctx.response.body = recvAndPayPayRecv() });
router.get('/api/v3/recvAndPay/import_recv', (ctx) => { ctx.response.body = recvAndPayRecv() });
router.get('/api/v3/recvAndPay/import_pay', (ctx) => { ctx.response.body = recvAndPayPay() });

// setting
router.get('/api/v3/set/account/query', (ctx) => { ctx.response.body = setAccountQuery() });
router.post('/api/v3/set/account/add', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/set/account/recycle/query', (ctx) => { ctx.response.body = setAccountQuery() });
router.post('/api/v3/set/account/recycle/recover', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/set/account/timezone/query', (ctx) => { ctx.response.body = setAccountTimezoneQuery() });
router.post('/api/v3/set/account/timezone/update', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/set/account/setting/query', (ctx) => { ctx.response.body = setAccountSettingQuery() });
router.post('/api/v3/set/account/switch', (ctx) => { ctx.response.body = returnData() });
router.post('/api/v3/set/account/setting/update', (ctx) => { ctx.response.body = returnData() });
router.post('/api/v3/set/account/delete', (ctx) => { ctx.response.body = returnData() });
router.post('/api/v3/set/account/wallet/lock', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/set/account/observer/query', (ctx) => { ctx.response.body = setAccountObserverQuery() });
router.post('/api/v3/set/account/observer/delete', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/set/account/wallet/merge/query', (ctx) => { ctx.response.body = setAccountWalletMergeQuery() });
router.post('/api/v3/set/account/wallet/merge/update', (ctx) => { ctx.response.body = returnData() });
router.get('/api/v3/set/account/share/query', (ctx) => { ctx.response.body = setAccountShareQuery() });
router.post('/api/v3/set/account/share/add', (ctx) => { ctx.response.body = returnData() });
router.post('/api/v3/set/account/share/delete', (ctx) => { ctx.response.body = returnData() });
router.post('/api/v3/set/account/update/remark', (ctx) => { ctx.response.body = returnData() });

// home
router.get('/auth/v3/index/coinList', (ctx) => { ctx.response.body = coinListQuery() });
router.get('/lab/poolcoins', (ctx) => { ctx.response.body = labCoinListQuery() });
router.get('/auth/v3/index/coinDetail', (ctx) => { ctx.response.body = coinDetailQuery() });
router.get('/lab/coinDetail', (ctx) => { ctx.response.body = coinDetailQuery() });
router.get('/auth/v3/index/poolHashChart', (ctx) => { ctx.response.body = hashGraph() });
router.get('/lab/poolHashChart', (ctx) => { ctx.response.body = hashGraph() });
router.get('/auth/v3/index/poolLuckyChart', (ctx) => { ctx.response.body = luckyGraph() });
router.get('/auth/v3/index/announcement', (ctx) => { ctx.response.body = newsQuery() });
router.get('/auth/:wallet_address/validate', (ctx) => { ctx.response.body = walletAddrVal() });
router.get('/auth/v3/index/ppsplusReward', (ctx) => { ctx.response.body = PPLNSReward() });


module.exports = router;
