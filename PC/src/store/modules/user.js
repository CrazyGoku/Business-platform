import { loginByUsername, logout, getUserInfo, getRolesFunctions } from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  getUserId,
  setUserId,
  removeUserId,
  getStoreId,
  setStoreId,
  removeStoreId
} from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    storeId: getStoreId(),
    userId: getUserId(),
    phone: '',
    storeName: ''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_STORE_ID: (state, storeId) => {
      state.storeId = storeId
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_STORE_NAME: (state, storeName) => {
      state.storeName = storeName
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      userInfo.username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(response => {
          if (response.data.code !== 1001) {
            reject(response.data.message)
            return
          }
          const data = response.data.data
          commit('SET_TOKEN', data.token)
          commit('SET_USER_ID', data.id)
          commit('SET_STORE_ID', data.storeId)
          setToken(data.token)
          setUserId(data.id)
          setStoreId(data.storeId)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo({ storeId: state.storeId }, state.userId).then(response => {
          if (response.data.code !== 1001) {
            dispatch('LogOut')
            reject('登录失败，请稍后重试')
          }
          const data = response.data.data
          commit('SET_AVATAR', data.avatar)
          commit('SET_NAME', data.name)
          commit('SET_PHONE', data.phone)
          commit('SET_INTRODUCTION', data.introduction)
          getRolesFunctions({ storeId: state.storeId, userId: state.userId }).then(res => {
            if (res.data.code !== 1001) {
              dispatch('LogOut')
              reject('登录失败，请稍后重试')
            }
            const _data = res.data.data
            if (_data && _data.length > 0) { // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', _data)
              resolve(_data)
            } else {
              reject('getInfo: roles must be a non-null array !')
            }
          })
          // let roles = []
          // const _roles = data.roles // note: roles must be a array! such as: ['editor','develop']
          // _roles.forEach(v=>{
          //   roles.push(v.id)
          // })
          // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', roles)
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.storeId).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeUserId()
          removeStoreId()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeUserId()
        removeStoreId()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
