import request from '@/utils/request'
// get请求
export function getSellResult(params) {
  return request({
    url: '/main_store/sell/result',
    method: 'get',
    params
  })
}

// 查看结果详情
export function getSellResultDetails(params, path) {
  return request({
    url: '/main_store/sell/result/detail/' + path,
    method: 'get',
    params
  })
}
// 红冲销售结果订单
export function postRedDashed(params) {
  return request({
    url: '/main_store/sell/result/redDashed',
    method: 'post',
    params
  })
}
