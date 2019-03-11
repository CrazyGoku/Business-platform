import request from '@/utils/request'
// 应付期初设置
export function putNeedInOpening(data) {
  return request({
    url: '/main_store/fund/needIn/opening',
    method: 'put',
    data
  })
}

export function getNeedInOpening(params) {
  return request({
    url: '/main_store/fund/needIn/opening',
    method: 'get',
    params
  })
}
