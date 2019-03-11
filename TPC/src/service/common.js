import request from '@/utils/request'

export function getStartBill(path) {
  return request({
    url: '/pps/system/startBill/'+path,
    method: 'get'
  })
}

export function putStartBill(data) {
  return request({
    url: '/pps/system/startBill',
    method: 'put',
    data
  })
}
export function getSystem() {
  return request({
    url: '/pps/system',
    method: 'get'
  })
}

export function putSystem(data) {
  return request({
    url: '/pps/system',
    method: 'put',
    data
  })
}

export function getStore(path) {
  return request({
    url: '/pps/stores/'+path,
    method: 'get'
  })
}

export function rebuild(data) {
  console.log(data)
  return request({
    url: '/pps/system/rebuild',
    method: 'put',
    data
  })
}
