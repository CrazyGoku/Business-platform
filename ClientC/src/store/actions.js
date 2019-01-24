import {getToken, setToken, removeToken, getId, setId, removeId} from '@/utils/auth'
import {getInfo} from "../api/login";
import router from '@/router/index'
import store from './index'

export const FedLogOut = function () {
  console.log(router)
  return new Promise(resolve => {
    store.commit('SET_TOKEN', '')
    store.commit('SET_ID', '')
    store.commit('SET_TAB_ACTIVE', 0)
    store.commit('SET_USERINFO', {})
    removeToken()
    removeId()
    router.replace({name: 'Login'})
    resolve()
  })
}

// 获取用户信息
export const GetInfo = function () {
  return new Promise((resolve, reject) => {
    const payload = {
      id: getId(),
      token: getToken()
    }
    getInfo(payload).then(response => {
      const data = response.data.content[0]
      store.commit('SET_USERINFO', data)
      store.commit('SET_TOKEN', getToken())
      store.commit('SET_ID', getId())
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
