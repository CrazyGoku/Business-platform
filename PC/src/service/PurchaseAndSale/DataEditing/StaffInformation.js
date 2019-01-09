import request from '@/utils/request'
// get请求
export function getRolesData(params) {
  return request({
    url: '/pps/roles',
    method: 'get',
    params
  })
}
// post 请求

export function postRolesData(data) {
  return request({
    url: '/pps/roles',
    method: 'post',
    data
  })
}
// put 请求
export function putRolesData(data) {
  return request({
    url: '/pps/roles',
    method: 'put',
    data
  })
}
// delete请求
export function delRolesData(params) {
  return request({
    url: '/pps/roles',
    method: 'delete',
    params
  })
}
