import API from 'src/api/axios'

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    async dashboardHash() {
      const res = await API.get('/api/v3/dashboard/hash/query')
      return res.data
    },
    async dashboardWorkerNum() {
      const res = await API.get('/api/v3/dashboard/workerNum/query')
      return res.data
    },
    async dashboardGraph({commit}, data) {
      const res = await API.get('/api/v3/dashboard/graph/query', {params: data})
      return res.data
    },
    async dashboardMinerInfo() {
      const res = await API.get('/api/v3/pool/mining/info/query')
      return res.data
    },
    async dashboardEarnings() {
      const res = await API.get('/api/v3/dashboard/earnings/query')
      return res.data
    },
  },
  getters: {
  }
};
