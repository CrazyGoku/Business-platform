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
export function getPushMoneyRate() {
  return request({
    url: '/pps/system/pushMoneyRate',
    method: 'get'
  })
}

export function putPushMoneyRate(data) {
  console.log(data)
  return request({
    url: '/pps/system/pushMoneyRate',
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
