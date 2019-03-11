import request from '@/utils/request'
// get请求
export function getUsersData(params) {
  return request({
    url: '/main_store/users',
    method: 'get',
    params
  })
}
export function getRolesData(params) {
  return request({
    url: '/main_store/roles',
    method: 'get',
    params
  })
}
// post 请求

export function postUsersData(data) {
  return request({
    url: '/main_store/users',
    method: 'post',
    data
  })
}
// put 请求
export function putUsersData(data) {
  return request({
    url: '/main_store/users',
    method: 'put',
    data
  })
}
// delete请求
export function delUsersData(params) {
  return request({
    url: '/main_store/users',
    method: 'delete',
    params
  })
}
