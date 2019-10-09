import API from 'src/api/axios'

export default {
  state: {},
  mutations: {},
  actions: {
    async recvAndPayRecv({commit}, data) {
      const res = await API.get('/api/v3/recvAndPay/recv', {params: data})
      return res.data
    },
    async recvAndPayPay({commit}, data) {
      const res = await API.get('/api/v3/recvAndPay/pay', {params: data})
      return res.data
    },
    async recvAndPayPayRecv({commit}, data) {
      const res = await API.get('/api/v3/recvAndPay/payRecv', {params: data})
      return res.data
    },
    async recvAndPayExportRecv({commit}, data) {
      const res = await API.get('/api/v3/recvAndPay/import_recv', {params: data})
      return res.data
    },
    async recvAndPayExportPay({commit}, data) {
      const res = await API.get('/api/v3/recvAndPay/import_pay', {params: data})
      return res.data
    },
  },
  getters: {}
};
