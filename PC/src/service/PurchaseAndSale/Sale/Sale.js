import request from '@/utils/request'
// get请求
export function getSellResult(params) {
  return request({
    url: '/pps/sell/result',
    method: 'get',
    params
  })
}

// 查看结果详情
export function getSellResultDetails(params, path) {
  return request({
    url: '/pps/sell/result/detail/' + path,
    method: 'get',
    params
  })
}
// 红冲销售结果订单
export function postRedDashed(data) {
  return request({
    url: '/pps/sell/result/redDashed',
    method: 'post',
    data
  })
}
