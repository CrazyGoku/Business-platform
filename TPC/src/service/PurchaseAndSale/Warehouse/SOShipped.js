import request from '@/utils/request'
// get请求
export function getSuppliers(params) {
  return request({
    url: '/pps/suppliers',
    method: 'get',
    params
  })
}

export function getOrderStorage(params, path) {
  return request({
    url: '/pps/orders/storage/' + path,
    method: 'get',
    params
  })
}
