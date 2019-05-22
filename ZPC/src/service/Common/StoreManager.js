import request from '@/utils/request'
// get请求
export function getStore(params) {
  return request({
    url: '/main_store/stores',
    method: 'get',
    params
  })
}

export function postStore(data) {
  return request({
    url: '/main_store/stores/07c7f345-037e-11e9-a5eb-54ee75c0f47a',
    method: 'post',
    data
  })
}

export function putStore(data) {
  return request({
    url: '/main_store/stores/07c7f345-037e-11e9-a5eb-54ee75c0f47a',
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
