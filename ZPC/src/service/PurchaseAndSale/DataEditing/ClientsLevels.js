import store from '@/store'
import request from '@/utils/request'
// get请求
// 查找所有客户级别
export function getClientsLevels(params) {
  return request({
    url: '/main_store/clients/levels',
    method: 'get',
    params
  })
}
// 新增所有客户级别
export function postClientsLevels(data) {
  return request({
    url: '/main_store/clients/levels/' + '07c7f345-037e-11e9-a5eb-54ee75c0f47a',
    method: 'post',
    data
  })
}
// 修改所有客户级别
export function putClientsLevels(data) {
  return request({
    url: '/main_store/clients/levels/' + '07c7f345-037e-11e9-a5eb-54ee75c0f47a',
    method: 'put',
    data
  })
}
// 删除客户级别
export function delClientsLevels(params) {
  return request({
    url: '/main_store/clients/levels/' + '07c7f345-037e-11e9-a5eb-54ee75c0f47a',
    method: 'delete',
    params
  })
}
