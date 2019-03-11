import request from '@/utils/request'
// get请求
export function getFundOut(params) {
  return request({
    url: '/pps/fund/out',
    method: 'get',
    params
  })
}
