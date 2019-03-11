import request from '@/utils/request'
// get请求
export function getStore(params) {
  return request({
    url: '/main_store/stores',
    method: 'get',
    params
  })
}

export function postStore(data,path) {
  return request({
    url: '/main_store/stores/'+path,
    method: 'post',
    data
  })
}

export function putStore(data,path) {
  return request({
    url: '/main_store/stores/'+path,
    method: 'put',
    data
  })
}

export function initialization(path) {
  return request({
    url: '/main_store/stores/initialization/' + path,
    method: 'get'
  })
}

export function clientLogin(data) {
  return request({
    url: '/main_store/clients/login',
    method: 'post',
    data
  })
}
