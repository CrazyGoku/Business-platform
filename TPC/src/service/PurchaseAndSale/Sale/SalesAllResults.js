import request from '@/utils/request'
// get请求
export function getSaleAllResult(params) {
  return request({
    url: '/pps/sell/result',
    method: 'get',
    params
  })
}
// 根据订单编号查看详情
export function getSaleResultDetails(params, path) {
  return request({
    url: '/pps/sell/result/detail/' + path,
    method: 'get',
    params
  })
}
