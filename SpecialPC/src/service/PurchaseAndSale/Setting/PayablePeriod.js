import request from '@/utils/request'
// 应付期初设置
export function putNeedOutOpening(data) {
  return request({
    url: '/main_store/fund/needOut/opening',
    method: 'put',
    data
  })
}
export function getNeedOutOpening(params) {
  return request({
    url: '/main_store/fund/needOut/opening',
    method: 'get',
    params
  })
}
