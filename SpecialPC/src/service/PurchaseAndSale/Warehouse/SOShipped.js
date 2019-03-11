import request from '@/utils/request'
// get请求
export function getSuppliers(params) {
  return request({
    url: '/main_store/suppliers',
    method: 'get',
    params
  })
}

export function getOrderStorage(params, path) {
  return request({
    url: '/main_store/orders/storage/' + path,
    method: 'get',
    params
  })
}
