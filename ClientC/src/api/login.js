import request from '@/utils/request'

export function login(payload) {
  return request({
    url: '/pps/clients/login',
    method: 'post',
    params: payload
  })
}

export function getInfo(path) {
  return request({
    url: '/pps/clients/'+path,
    method: 'get'
  })
}

export function logout(params) {
  return request({
    url: '/pps/clients/login',
    method: 'get',
    params
  })
}

export function getVerificationCode() {
  return request({
    url: '/user/vCode',
    method: 'get'
  })
}

export function changeInfo(payload) {
  return request({
    url: '/user/update',
    method: 'post',
    data: payload
  })
}

