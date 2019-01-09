import request from '@/utils/request'
// get请求
// 查找所有客户级别
export function getClientsLevels(params) {
  return request({
    url: '/pps/clients/levels',
    method: 'get',
    params
  })
}
// 新增所有客户级别
export function postClientsLevels(data) {
  return request({
    url: '/pps/clients/levels',
    method: 'post',
    data
  })
}
// 修改所有客户级别
export function putClientsLevels(data) {
  return request({
    url: '/pps/clients/levels',
    method: 'put',
    data
  })
}
// 删除客户级别
export function delClientsLevels(params) {
  return request({
    url: '/pps/clients/levels',
    method: 'delete',
    params
  })
}
