import api from '@/api'

export default {
  state: {
    ct: undefined,
    token: undefined
  },
  mutations: {
    updateCT (state, ct) {
      state.ct = ct
    },
    updateToken (state, token) {
      state.token = token
    },
    clearTechControl (state) {
      state.ct = undefined
      state.token = undefined
    }
  },
  actions: {
    async getTechControl ({ commit, state, rootState }) {
      if (rootState.api && rootState.api.fetching && rootState.api.fetching.otc) {
        return
      }
      const response = await api.getOTC(rootState.histovec.code || rootState.histovec.id, state.token, rootState.histovec.key, rootState.histovec.otcId, localStorage.getItem('userId'))
      if (response.success) {
        commit('updateCT', response.ct)
      }
      return
    }
  }
}