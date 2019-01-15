import request from '@/utils/request'
// get请求
export function getStore(params) {
  return request({
    url: '/pps/stores',
    method: 'get',
    params
  })
}

export function postStore(data) {
  return request({
    url: '/pps/stores',
    method: 'post',
    data
  })
}

export function putStore(data) {
  return request({
    url: '/pps/stores',
    method: 'put',
    data
  })
}

export function initialization(path) {
  return request({
    url: '/pps/stores/initialization/' + path,
    method: 'get'
  })
}
