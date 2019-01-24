import request from '@/utils/request'
// get请求
//资金报表-查费用-按明细
export function getReportFundOutByDetails(params) {
  return request({
    url: '/pps/report/fund/out/byDetails',
    method: 'get',
    params
  })
}
//资金报表-查费用-按往来单位
export function getReportFundOutByTarget(params) {
  return request({
    url: '/pps/report/fund/out/byTarget',
    method: 'get',
    params
  })
}
//资金报表-查费用-按分类
export function getReportFundOutByType(params) {
  return request({
    url: '/pps/report/fund/out/byType',
    method: 'get',
    params
  })
}
//资金报表-查费用-按职员
export function getReportFundOutByUser(params) {
  return request({
    url: '/pps/report/fund/out/byUser',
    method: 'get',
    params
  })
}
