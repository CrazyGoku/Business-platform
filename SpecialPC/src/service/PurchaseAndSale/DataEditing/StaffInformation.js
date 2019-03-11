import request from '@/utils/request'
// get请求
export function getRolesData(params) {
  return request({
    url: '/main_store/roles',
    method: 'get',
    params
  })
}
export function getRolesFunctions(params) {
  return request({
    url: '/main_store/roles/functions',
    method: 'get',
    params
  })
}
// post 请求

export function postRolesData(data) {
  return request({
    url: '/main_store/roles',
    method: 'post',
    data
  })
}
// put 请求
export function putRolesData(data) {
  return request({
    url: '/main_store/roles',
    method: 'put',
    data
  })
}
// 修改角色对应的功能
export function putRolesFunctions(data) {
  return request({
    url: '/main_store/roles/functions',
    method: 'put',
    data
  })
}
// delete请求
export function delRolesData(params) {
  return request({
    url: '/main_store/roles',
    method: 'delete',
    params
  })
}
