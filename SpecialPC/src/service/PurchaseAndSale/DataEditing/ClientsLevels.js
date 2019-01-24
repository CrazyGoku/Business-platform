import store from '@/store'
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
export function postClientsLevels(data,path) {
  return request({
    url: '/pps/clients/levels/'+path,
    method: 'post',
    data
  })
}
// 修改所有客户级别
export function putClientsLevels(data,path) {
  return request({
    url: '/pps/clients/levels/'+path,
    method: 'put',
    data
  })
}
// 删除客户级别
export function delClientsLevels(params,path) {
  return request({
    url: '/pps/clients/levels/'+path,
    method: 'delete',
    params
  })
}
