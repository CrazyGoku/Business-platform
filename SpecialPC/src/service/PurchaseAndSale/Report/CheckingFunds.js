import request from '@/utils/request'
// get请求
//查资金-资金流水/资金对账
export function getFundCheck(params) {
  return request({
    url: '/main_store/fund/check',
    method: 'get',
    params
  })
}
//查资金-资金余额
export function getFundBalance(params) {
  return request({
    url: '/main_store/fund/balance',
    method: 'get',
    params
  })
}
