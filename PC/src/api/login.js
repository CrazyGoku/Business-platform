import request from '@/utils/request'

export function loginByUsername(data) {
  return request({
    url: '/pps/login',
    method: 'post',
    data
  })
}

export function logout(path) {
  return request({
    url: '/pps/logout/' + path,
    method: 'get'
  })
}

export function getUserInfo(params, path) {
  return request({
    url: '/pps/users/' + path,
    method: 'get',
    params
  })
}

export function getVerificationCode(params) {
  return request({
    url: '/pps/identifyingCode',
    method: 'get',
    params
  })
}
// 根据编号查询功能
export function getRolesFunctions(params) {
  return request({
    url: '/pps/roles/functions',
    method: 'get',
    params
  })
}

// 查询所有店铺
export function getStore(params) {
  return request({
    url: '/pps/stores',
    method: 'get',
    params
  })
}
