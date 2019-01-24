import request from '@/utils/request'
// get请求
export function getProcurementResult(params) {
  return request({
    url: '/pps/procurement/result',
    method: 'get',
    params
  })
}

// 查看结果详情
export function getOrderResultDetails(params, path) {
  return request({
    url: '/pps/procurement/result/detail/' + path,
    method: 'get',
    params
  })
}

