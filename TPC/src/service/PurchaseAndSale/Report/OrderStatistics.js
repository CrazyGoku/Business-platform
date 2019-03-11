import request from '@/utils/request'
// get请求
// 订单统计-客户订货分析
export function getReportOrderByClient(params) {
  return request({
    url: '/pps/report/order/byClient',
    method: 'get',
    params
  })
}
// 订单统计-商品订货分析
export function getReportOrderByGoods(params) {
  return request({
    url: '/pps/report/order/byGoods',
    method: 'get',
    params
  })
}

// 订单统计-订单分析
export function getReportOrderByOrder(params) {
  return request({
    url: '/pps/report/order/byOrder',
    method: 'get',
    params
  })
}
