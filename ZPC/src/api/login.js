import request from '@/utils/request'

export function loginByUsername(data) {
  return request({
    url: '/main_store/login',
    method: 'post',
    data
  })
}

export function logout(params, path) {
  return request({
    url: '/main_store/logout/' + path,
    method: 'get',
    params
  })
}

export function getUserInfo(params, path) {
  return request({
    url: '/main_store/users/' + path,
    method: 'get',
    params
  })
}

export function getVerificationCode(params) {
  return request({
    url: '/main_store/identifyingCode',
    method: 'get',
    params
  })
}
// 根据编号查询功能
export function getRolesFunctions(params) {
  return request({
    url: '/main_store/roles/functions',
    method: 'get',
    params
  })
}

// 查询所有店铺
export function getStore(params) {
  return request({
    url: '/main_store/stores',
    method: 'get',
    params
  })
}
