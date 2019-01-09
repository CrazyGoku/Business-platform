import request from '@/utils/request'
// get请求
// 查找所有客户级别
export function getClientsMembershipNumber(params) {
  return request({
    url: '/pps/clients/membershipNumbers',
    method: 'get',
    params
  })
}
// 新增所有客户级别
export function postClientsMembershipNumber(data) {
  return request({
    url: '/pps/clients/membershipNumbers',
    method: 'post',
    data
  })
}
// 修改所有客户级别
export function putClientsMembershipNumber(data) {
  return request({
    url: '/pps/clients/membershipNumbers',
    method: 'put',
    data
  })
}
// 删除客户级别
export function delClientsMembershipNumber(params) {
  return request({
    url: '/pps/clients/membershipNumbers',
    method: 'delete',
    params
  })
}
