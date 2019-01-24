import * as types from './mutation-type'

const matutaions = {
  [types.SET_INCLUDE_COMPS] (state, comps) {
    state.includeComps = comps
  },
  [types.SET_LOADING] (state, loading) {
    state.loading = loading
  },
  [types.SET_TAB_ACTIVE] (state, tabActive) {
    state.tabActive = tabActive
  },
  [types.SET_ID] (state, id) {
    state.id = id
  },
  [types.SET_TOKEN] (state, token) {
    state.token = token
  },
  [types.SET_USERINFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  [types.SET_PATH] (state, path) {
    state.path = path
  },
}

export default matutaions
