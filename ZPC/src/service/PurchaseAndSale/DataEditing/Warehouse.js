import request from '@/utils/request'
// get请求
export function getWarehouseData(params) {
  return request({
    url: '/main_store/warehouses',
    method: 'get',
    params
  })
}

// post 请求

export function postWarehouseData(data) {
  return request({
    url: '/main_store/warehouses',
    method: 'post',
    data
  })
}
// put 请求
export function putWarehouseData(data) {
  return request({
    url: '/main_store/warehouses',
    method: 'put',
    data
  })
}
// delete请求
export function delWarehouseData(params) {
  return request({
    url: '/main_store/warehouses',
    method: 'delete',
    params
  })
}

// 通过id查询仓库
export function findWarehouseById(params, path) {
  return request({
    url: '/main_store/warehouses/' + path,
    method: 'get',
    params
  })
}
