import request from '@/utils/request'
// 应付期初设置
export function putNeedOutOpening(data) {
  return request({
    url: '/pps/fund/needOut/opening',
    method: 'put',
    data
  })
}
export function getNeedOutOpening(params) {
  return request({
    url: '/pps/fund/needOut/opening',
    method: 'get',
    params
  })
}
