import request from '@/utils/request'
// get请求
export function getCustomerData(params) {
  return request({
    url: '/pps/clients',
    method: 'get',
    params
  })
}

export function getIntegralsData(params) {
  return request({
    url: '/pps/clients/integrals/details',
    method: 'get',
    params
  })
}
export function getLevelData(params) {
  return request({
    url: '/pps/clients/levels',
    method: 'get',
    params
  })
}
// 新增客户
export function postClients(data) {
  return request({
    url: '/pps/clients',
    method: 'post',
    data
  })
}
