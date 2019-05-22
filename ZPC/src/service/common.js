import request from '@/utils/request'
import store from '@/store/index.js'
export function getStartBill(path) {
  return request({
    url: '/main_store/system/startBill/' + path,
    method: 'get'
  })
}

export function putStartBill(data) {
  return request({
    url: '/main_store/system/startBill',
    method: 'put',
    data
  })
}
export function getSystem() {
  return request({
    url: '/main_store/system',
    method: 'get'
  })
}

export function putSystem(data) {
  return request({
    url: '/main_store/system',
    method: 'put',
    data
  })
}

export function getStore(path) {
  return request({
    url: '/main_store/stores/' + path,
    method: 'get'
  })
}

export function rebuild(data) {
  console.log(data)
  return request({
    url: '/main_store/system/rebuild',
    method: 'put',
    data
  })
}

export function getTodayReport(params) {
  return request({
    url: '/main_store/report/report',
    method: 'get',
    params
  })
}

