import API from 'src/api/axios'

export default {
  state: {},
  mutations: {},
  actions: {
    async setAccountQuery({commit}, data) {
      const res = await API.get('/api/v3/set/account/query', {params: data});
      return res.data
    },
    async setAccountAdd({commit}, data) {
      const res = await API.post('/api/v3/set/account/add', data)
      return res.data
    },
    async setAccountRecycleQuery({commit}, data) {
      const res = await API.get('/api/v3/set/account/recycle/query', {params: data})
      return res.data
    },
    async setAccountRecycleRecover({commit}, data) {
      const res = await API.post('/api/v3/set/account/recycle/recover', data)
      return res.data
    },
    async setAccountTimezoneQuery({commit}) {
      const res = await API.get('/api/v3/set/account/timezone/query')
      return res.data
    },
    async setAccountTimezoneUpdate({commit}, data) {
      const res = await API.post('/api/v3/set/account/timezone/update', data)
      return res.data
    },
    async setAccountSettingQuery({commit}, data) {
      const res = await API.get('/api/v3/set/account/setting/query', {params: data})
      return res.data
    },
    async setAccountSwitch({commit}, data) {
      const res = await API.post('/api/v3/set/account/switch', data)
      return res.data
    },
    async setAccountSettingUpdate({commit}, data) {
      const res = await API.post('/api/v3/set/account/setting/update', data)
      return res.data
    },
    async setAccountDelete({commit}, data) {
      const res = await API.post('/api/v3/set/account/delete', data)
      return res.data
    },
    async setAccountWalletLock({commit}, data) {
      const res = await API.post('/api/v3/set/account/wallet/lock', data)
      return res.data
    },
    async setAccountObserverQuery({commit}, data) {
      const res = await API.get('/api/v3/set/account/observer/query', {params: data})
      return res.data
    },
    async setAccountObserverDelete({commit}, data) {
      const res = await API.post('/api/v3/set/account/observer/delete', data)
      return res.data
    },
    async setAccountWalletMergeQuery({commit}, data) {
      const res = await API.get('/api/v3/set/account/wallet/merge/query', {params: data})
      return res.data
    },
    async setAccountWalletMergeUpdate({commit}, data) {
      const res = await API.post('/api/v3/set/account/wallet/merge/update', data)
      return res.data
    },
    async setAccountShareQuery({commit}, data) {
      const res = await API.get('/api/v3/set/account/share/query', {params: data})
      return res.data
    },
    async setAccountShareAdd({commit}, data) {
      const res = await API.post('/api/v3/set/account/share/add', data)
      return res.data
    },
    async setAccountShareDelete({commit}, data) {
      const res = await API.post('/api/v3/set/account/share/delete', data)
      return res.data
    },
    async setAccountUpdateRemark({commit}, data) {
      const res = await API.post('/api/v3/set/account/update/remark', data)
      return res.data
    },
  },
  getters: {}
};
