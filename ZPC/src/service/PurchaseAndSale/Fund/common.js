import request from '@/utils/request'
// get请求
export function getSuppliers(params) {
  return request({
    url: '/main_store/suppliers',
    method: 'get',
    params
  })
}
export function getOrderFund(params, path) {
  return request({
    url: '/main_store/fund/' + path,
    method: 'get',
    params
  })
}
// 根据type查询其他收入单/费用单
export function getFundResult(params, path) {
  return request({
    url: '/main_store/fund/result/' + path,
    method: 'get',
    params
  })
}
// 新增其他收入单/费用单
export function postFundResult(data) {
  return request({
    url: '/main_store/fund/result',
    method: 'post',
    data
  })
}

// 红冲资金
export function postRedDashed(params) {
  return request({
    url: '/main_store/fund/result/redDashed',
    method: 'post',
    params
  })
}
// 红冲资金
export function postRedDashed2(params) {
  return request({
    url: '/main_store/fund/redDashed',
    method: 'post',
    params
  })
}

// 新增收/付款单、预收/付款单
export function postFundOrder(data) {
  return request({
    url: '/main_store/fund',
    method: 'post',
    data
  })
}
// 获取账户
export function getBankFund(params) {
  return request({
    url: '/main_store/bankAccounts',
    method: 'get',
    params
  })
}
// 查询预收/付款余额
export function getFundAdvance(params) {
  return request({
    url: '/main_store/fund/advance',
    method: 'get',
    params
  })
}
// 获取客户
export function getClients(params) {
  return request({
    url: '/main_store/clients',
    method: 'get',
    params
  })
}
