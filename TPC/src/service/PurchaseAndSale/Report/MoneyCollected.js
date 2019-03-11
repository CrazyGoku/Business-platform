import request from '@/utils/request'
// get请求
//资金报表-查回款-按账户
export function getReportFundInByBankAccount(params) {
  return request({
    url: '/pps/report/fund/in/byBankAccount',
    method: 'get',
    params
  })
}
//资金报表-查回款-职员
export function getReportFundInByUser(params) {
  return request({
    url: '/pps/report/fund/in/byUser',
    method: 'get',
    params
  })
}
