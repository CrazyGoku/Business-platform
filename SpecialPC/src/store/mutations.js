import * as types from './mutation-type'

const matutaions = {
  // [types.SET_INCLUDE_COMPS](state, comps) {
  //   state.includeComps = comps
  // },
  [types.SET_USER_ID](state, userId) {
    state.user.userId = userId
  },
}

export default matutaions
