import request from '@/utils/request'
// get请求
export function getSuppliers(params) {
  return request({
    url: '/pps/suppliers',
    method: 'get',
    params
  })
}
export function getOrderFund(params, path) {
  return request({
    url: '/pps/fund/' + path,
    method: 'get',
    params
  })
}

// 红冲资金
export function postRedDashed(params) {
  return request({
    url: '/pps/fund/redDashed',
    method: 'post',
    params
  })
}

// 新增收/付款单、预收/付款单
export function postFundOrder(data) {
  return request({
    url: '/pps/fund',
    method: 'post',
    data
  })
}
// 获取账户
export function getBankFund(params) {
  return request({
    url: '/pps/bankAccounts',
    method: 'get',
    params
  })
}
// 查询预收/付款余额
export function getFundAdvance(params) {
  return request({
    url: '/pps/fund/advance',
    method: 'get',
    params
  })
}
// 获取客户
export function getClients(params) {
  return request({
    url: '/pps/clients',
    method: 'get',
    params
  })
}
