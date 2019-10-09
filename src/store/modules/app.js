import Cookies from 'js-cookie';
import API from 'src/api/axios'

export default {
  state: {
    isShowCoinSearch: false,
    isShowRemind: false,
    isWatchMode: false,
    reFetchApi: 0,
    lan: 'zh',
    userName: '',
    currentCoin: '',
    poolCoinsStatus: [],
    isGotToken: false,
    ssoUrl: '',
    isInitData: false,
    siteUrl: '',
    centerUrl: '',
    userId: '',
    coinUrlName: '',
    permission: 'all',
    userWebType: [],
    // 设置显示创建子账号
    displayCreatSubAcc: 'loading',
    // 获取header中的子账号
    reFetchUserList: 0,
    // 登录状态 noLogin; login;
    loginStatus: '',
    redirectUrl: '',
    // 是否是PC用户
    isPc: '',
    // 子账号信息
    userIdListData: []
  },
  mutations: {
    setLoginStatus(state, str) { state.loginStatus = str },
    setFetchUserList(state, bool) { state.reFetchUserList += 1 },
    setShowCoinSearch(state, bool) { state.isShowCoinSearch = bool },
    setShowRemind(state, bool) { state.isShowRemind = bool },
    setWatchMode(state, bool) { state.isWatchMode = bool },
    setReFetchApi(state, number) { state.reFetchApi = number },
    setLan(state, lan) {
      state.lan = lan;
      localStorage.setItem('language', lan);
      Cookies.set('language', lan)
    },
    setGotToken(state, bool) { state.isGotToken = bool },
    setUserId(state, userId) {
      state.userId = userId;
      localStorage.setItem('userId', userId);
    },
    setUserName(state, userName) {
      state.userName = userName;
      localStorage.setItem('userName', userName);
    },
    setCurrentCoin(state, currentCoin) {
      localStorage.setItem('currentCoin', currentCoin);
      state.currentCoin = currentCoin;
      state.coinUrlName = currentCoin;
      if (currentCoin === "BCH") state.coinUrlName = "BCC";
      else if (currentCoin === "SCC") state.coinUrlName = "SC";
      else if (currentCoin === "DASH") state.coinUrlName = "DAS";
      else if (currentCoin === "XMC") state.coinUrlName = "XMR";
      else if (currentCoin === "BCC") {
        state.currentCoin = "BCH";
        localStorage.setItem("currentCoin", "BCH");
      } else if (currentCoin === "SC") {
        state.currentCoin = "SCC";
        localStorage.setItem("currentCoin", "SCC");
      } else if (currentCoin === "DAS") {
        state.currentCoin = "DASH";
        localStorage.setItem("currentCoin", "DASH");
      } else if (currentCoin === "XMR") {
        state.currentCoin = "XMC";
        localStorage.setItem("currentCoin", "XMC");
      }
    },
    setInitData(state, bool) { state.isInitData = bool },
    setPermission(state, value) { state.permission = value },
    setUserWebType(state, value) { state.userWebType = value }, 
    setUserListInfo(state, data) {
      if (data.needAdd !== "1") {
        state.displayCreatSubAcc = false;
      } else state.displayCreatSubAcc = true;
      state.userIdListData = data || [];
    },
    setPcVar(state, bool) { state.isPc = bool },
    loginOut(state) {
      localStorage.clear();
      state.isShowCoinSearch = state.isShowRemind = false;
      state.isWatchMode = state.isGotToken = state.isInitData = false;
      state.userName = state.currentCoin = state.userId = state.coinUrlName = '';
      state.displayCreatSubAcc = 'loading';
      state.loginStatus = 'noLogin';
      state.permission = 'all';
      state.poolCoinsStatus = [];
      state.userIdListData = [];
      state.userWebType = [];
    }
  },
  actions: {
    async statsCurrent({commit}) {
      const res = await API.get('/api/v3/stats/current')
      return res.data;
    },
    async statsLogout({commit}) {
      const res = await API.get('/api/v3/stats/logout')
      return res.data
    },
    async statsSetCoinType({commit}, {coinType}) {
      await API.get('/api/v3/stats/setCoinType', {params: {coinType}})
    },
    async statsSetUser({commit}, {userId, coinType}) {
      await API.get('/api/v3/stats/setUser', {params: {userId, coinType}})
    },
    async statsUserList({commit}, {coinType}) {
      const res = await API.get('/api/v3/stats/userList', {params: {coinType}})
      if (res.data) commit('setUserListInfo', res.data);
      return res.data
    },
    async coinTypeList({commit}) {
      const res = await API.get('/api/v3/stats/coinTypeList')
      return res.data;
    },
    async statsCheck({commit}, {ticket, coinType, userId}) {
      const res = await API.get('/auth/v3/check', {params: {ticket, coinType, userId}})
      return res.data
    },
  },
  getters: {
    isShowCoinSearch: state => state.isShowCoinSearch,
    isShowRemind: state => state.isShowRemind,
    isWatchMode: state => state.isWatchMode,
    reFetchApi: state => state.reFetchApi,
    lan: state => state.lan,
    userName: state => state.userName,
    currentCoin: state => state.currentCoin,
    poolCoinsStatus: state => state.poolCoinsStatus,
    isGotToken: state => state.isGotToken,
    ssoUrl: state => state.ssoUrl,
    isInitData: state => state.isInitData,
    centerUrl: state => state.centerUrl,
    siteUrl: state => state.siteUrl,
    userId: state => state.userId,
    coinUrlName: state => state.coinUrlName,
    permission: state => state.permission,
    userWebType: state => state.userWebType,
    displayCreatSubAcc: state => state.displayCreatSubAcc,
    reFetchUserList: state => state.reFetchUserList,
    loginStatus: state => state.loginStatus,
    isPc: state => state.isPc,
    userIdListData: state => state.userIdListData,
    redirectUrl: state => {
      var strTemp = state.siteUrl+'/';
      if(state.loginStatus === 'login'){
        strTemp = state.siteUrl+'/user/loginJump.htm?redirect=';
      }
      state.redirectUrl = strTemp;
      return strTemp;
    },
  }
};
