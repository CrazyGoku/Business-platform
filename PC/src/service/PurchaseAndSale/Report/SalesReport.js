import request from '@/utils/request'
// get请求
// 销售报表-客户销售分析-按客户
export function getReportSellByClient(params) {
  return request({
    url: '/pps/report/sell/byClient',
    method: 'get',
    params
  })
}

// 销售报表-商品销售分析-按商品
export function getReportSellByGoods(params) {
  return request({
    url: '/pps/report/sell/byGoods',
    method: 'get',
    params
  })
}

// 销售报表-销售日月年报-销售日报
export function getReportSellByDay(params) {
  return request({
    url: '/pps/report/sell/byDay',
    method: 'get',
    params
  })
}
// 销售报表-销售日月年报-销售月报
export function getReportSellByMonth(params) {
  return request({
    url: '/pps/report/sell/byMonth',
    method: 'get',
    params
  })
}

// 销售报表-销售日月年报-销售年报
export function getReportSellByYear(params) {
  return request({
    url: '/pps/report/sell/byYear',
    method: 'get',
    params
  })
}
// 销售报表-业绩统计-按职员
export function getReportSellByUser(params) {
  return request({
    url: '/pps/report/sell/byUser',
    method: 'get',
    params
  })
}
// 销售报表-业绩统计-仓库
export function getReportSellByWarehouse(params) {
  return request({
    url: '/pps/report/sell/byWarehouse',
    method: 'get',
    params
  })
}
