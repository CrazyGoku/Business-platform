import request from '@/utils/request'
// get请求
// 查找所有客户级别
export function getClientsMembershipNumber(params,path) {
  return request({
    url: '/pps/clients/membershipNumbers/'+path,
    method: 'get',
    params
  })
}
// 新增所有客户级别
export function postClientsMembershipNumber(data,path) {
  return request({
    url: '/pps/clients/membershipNumbers/'+path,
    method: 'post',
    data
  })
}
// 修改所有客户级别
export function putClientsMembershipNumber(data,path) {
  return request({
    url: '/pps/clients/membershipNumbers/'+path,
    method: 'put',
    data
  })
}
// 删除客户级别
export function delClientsMembershipNumber(params,path) {
  return request({
    url: '/pps/clients/membershipNumbers/'+path,
    method: 'delete',
    params
  })
}
