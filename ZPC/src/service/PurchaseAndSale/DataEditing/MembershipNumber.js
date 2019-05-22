import request from '@/utils/request'
// get请求
// 查找所有客户级别
export function getClientsMembershipNumber(params) {
  return request({
    url: '/main_store/clients/membershipNumbers/07c7f345-037e-11e9-a5eb-54ee75c0f47a',
    method: 'get',
    params
  })
}
// 新增所有客户级别
export function postClientsMembershipNumber(data) {
  return request({
    url: '/main_store/clients/membershipNumbers/07c7f345-037e-11e9-a5eb-54ee75c0f47a',
    method: 'post',
    data
  })
}
// 修改所有客户级别
export function putClientsMembershipNumber(data) {
  return request({
    url: '/main_store/clients/membershipNumbers/07c7f345-037e-11e9-a5eb-54ee75c0f47a',
    method: 'put',
    data
  })
}
// 删除客户级别
export function delClientsMembershipNumber(params) {
  return request({
    url: '/main_store/clients/membershipNumbers/07c7f345-037e-11e9-a5eb-54ee75c0f47a',
    method: 'delete',
    params
  })
}
