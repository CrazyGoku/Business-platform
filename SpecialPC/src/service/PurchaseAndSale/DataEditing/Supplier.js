import request from '@/utils/request'
// get请求
export function getSupplierData(params) {
  return request({
    url: '/main_store/suppliers',
    method: 'get',
    params
  })
}

// post 请求

export function postSupplierData(data) {
  return request({
    url: '/main_store/suppliers',
    method: 'post',
    data
  })
}
// put 请求
export function putSupplierData(data) {
  return request({
    url: '/main_store/suppliers',
    method: 'put',
    data
  })
}
// delete请求
export function delSupplierData(params) {
  return request({
    url: '/main_store/suppliers',
    method: 'delete',
    params
  })
}

// 通过id查询供应商
export function findSupplierById(params, path) {
  return request({
    url: '/main_store/suppliers/' + path,
    method: 'get',
    params
  })
}
