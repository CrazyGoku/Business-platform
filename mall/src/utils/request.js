import axios from 'axios'
import { Toast ,Dialog} from 'vant';
import store from '../store'
import { getToken } from '@/utils/auth'
import qs from 'qs'
import { baseURL } from '../api/constants'
// 创建axios实例
axios.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';
const service = axios.create({
  baseURL: baseURL, // api的base_url
  timeout: 5000, // 请求超时时间
  withCredentials: true
  // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
// request拦截器
service.interceptors.request.use(
  config => {
    let loading = store.state.loading.slice()
    loading.push('loading')
    store.commit('SET_LOADING', loading)
    // config.data = qs.stringify(config.data)
    if (getToken()) {
      config.params = {
        token: getToken(),
        ...config.params
      }
      console.log(config.params)
      config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非1是抛错
     */
    const res = response.data
    let loading = store.state.loading.slice()
    if (loading.length > 0) {
      loading.pop()
      store.commit('SET_LOADING', loading)
    }
    if (res.code !== 1001) {
      Toast(res.error ? res.error : '请求出错啦！');
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Toast(error.message)
    return Promise.reject(error)
  }
)

export default service
