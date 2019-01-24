import request from '@/utils/request'
// get请求
// 获取供应商
export function getSuppliers(params) {
  return request({
    url: '/pps/suppliers',
    method: 'get',
    params
  })
}
// 获取客户

export function getClients(params) {
  return request({
    url: '/pps/clients',
    method: 'get',
    params
  })
}

