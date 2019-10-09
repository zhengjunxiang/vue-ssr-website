import API from 'src/api/axios'

export default {
  state: {
    workerWarnIsShow: false
  },
  mutations: {
    setWorkerWarnIsShow(state, data) {
      state.workerWarnIsShow = data;
    }
  },
  actions: {
    async workerRemind({commit}) {
      const res = await API.get('/api/v3/worker/remind');
      if (res) {
        if (res.data === 1) commit('setShowRemind', true);
        else commit('setShowRemind', false);
      }
    },
    async workerQuery({commit}, data) {
      const res = await API.get('/api/v3/worker/query', {params: data})
      return res.data
    },
    async workerExport({commit}, data) {
      const res = await API.get('/api/v3/worker/export', {params: data})
      return res.data
    },
    async workerDel({commit}, data) {
      const res = await API.post('/api/v3/worker/disable/delete', data)
      return res.data
    },
    async workerGraph({commit}, data) {
      const res = await API.get('/api/v3/worker/graph/query', {params: data})
      return res.data
    },
    async workerGroup({commit}, {pageNum, pageSize}) {
      const res = await API.get('/api/v3/worker/group/query', {params: {pageNum, pageSize}})
      return res.data
    },
    async workerGroupAdd({commit}, data) {
      const res = await API.post('/api/v3/worker/group/add', data)
      return res.data
    },
    async workerGroupDel({commit}, data) {
      const res = await API.post('/api/v3/worker/group/delete', data)
      return res.data
    },
    async workerGroupMove({commit}, data) {
      const res = await API.post('/api/v3/worker/group/move', data)
      return res.data
    },
    async workerGroupSummary({commit}, {groupId}) {
      const res = await API.get('/api/v3/worker/group/summary/query', {params: {groupId}})
      return res.data
    },
    async workerAllGraph({commit}, data) {
      const res = await API.get('/api/v3/worker/all/graph/query', {params: data})
      return res.data
    },
    async workerWarnQuery({commit}, data) {
      const res = await API.get('/api/v3/alarm/query', {params: data})
      return res.data
    },
    async workerWarnAddSave({commit}, data) {
      const res = await API.post('/api/v3/alarm/add', data)
      return res.data
    },
    async workerWarnListDel({commit}, data) {
      const res = await API.get('/api/v3/alarm/delete', {params: data})
      return res.data
    },
    async workerWarnSwitcher({commit}, data) {
      const res = await API.get('/api/v3/alarm/switcher', {params: data})
      return res.data
    },
    async workerWarnIsShow({commit}) {
      try {
        const res = await API.get('/api/v3/alarm/isShow')
        if (res.code == "000000") {commit('setWorkerWarnIsShow', res.data)
        }else {
          commit('setWorkerWarnIsShow', false)
        }
      } catch (e) {
        commit('setWorkerWarnIsShow', false)
      }
    }
  },
  getters: {
    workerWarnIsShow: state => state.workerWarnIsShow,
  }
};
