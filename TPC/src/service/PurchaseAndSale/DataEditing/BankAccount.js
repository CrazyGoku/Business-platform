import request from '@/utils/request'
// get请求
export function getBankAccountData(params) {
  return request({
    url: '/pps/bankAccounts',
    method: 'get',
    params
  })
}

// post 请求

export function postBankAccountData(data) {
  return request({
    url: '/pps/bankAccounts',
    method: 'post',
    data
  })
}
// put 请求
export function putBankAccountData(data) {
  return request({
    url: '/pps/bankAccounts',
    method: 'put',
    data
  })
}
// delete请求
export function delBankAccountData(params) {
  return request({
    url: '/pps/bankAccounts',
    method: 'delete',
    params
  })
}

// 通过id查询供应商
export function findBankAccountById(params, path) {
  return request({
    url: '/pps/bankAccounts/' + path,
    method: 'get',
    params
  })
}
