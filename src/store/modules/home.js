import API from 'src/api/axios'

export default {
  state: {
    epdRowLW:0,
    labCoinListArr:[],
    antPlCoinListArr:[]
  },
  mutations: {
    setEpdRowLW(state, wid){
      state.epdRowLW = wid;
    },
    setLabCoinList(state, data){
      if(data.items){
        state.labCoinListArr = data.items;
      }
    },
    setAntPlCoinList(state, data){
      if(data.items){
        state.antPlCoinListArr = data.items;
      }
    }
  },
  actions: {
    async coinListQuery({commit}, data) {
      const res = await API.get('/auth/v3/index/coinList', {params: data})
      if (res.data) commit('setAntPlCoinList', res.data)
      return res.data
    },
    async labCoinListQuery({commit}, data) {
      const res = await API.get('/lab/poolcoins', {params: data})
      if (res.data) commit('setLabCoinList', res.data)
      return res.data
    },
    async coinDetailQuery({commit}, data) {
      const res = await API.get('/auth/v3/index/coinDetail', {params: data})
      return res.data
    },
    async labCoinDetailQuery({commit}, data) {
      const res = await API.get('/lab/coinDetail', {params: data})
      return res.data
    },
    async hashGraph({commit}, data) {
      const res = await API.get('/auth/v3/index/poolHashChart', {params: data})
      return res.data
    },
    async labHashGraph({commit}, data) {
      const res = await API.get('/lab/poolHashChart', {params: data})
      return res.data
    },
    async luckyGraph({commit}, data) {
      const res = await API.get('/auth/v3/index/poolLuckyChart', {params: data})
      return res.data
    },
    async announcementQuery({commit}, data) {
      const res = await API.get('/auth/v3/index/announcement', {params: data})
      return res.data
    },
    async walletAddrVal(commit, {address, coinType}) {
      const res = await API.get(`/auth/${address}/validate`, {params: {coinType}})
      return res.data
    },
    async ppsplusReward(commit, {address, coinType}) {
      const res = await API.get('/auth/v3/index/ppsplusReward', {params: {coinType}})
      return res.data
    }
    
  },
  getters: {
    epdRowLW: state => state.epdRowLW,
    antPlCoinListArr: state => state.antPlCoinListArr,
    labCoinListArr: state => state.labCoinListArr
  }
};
