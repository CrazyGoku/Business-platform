import request from '@/utils/request'

export function getCommodityData(params) {
  const data = {
    ...params
  }
  return request({
    url: '/data/commodity',
    method: 'get',
    data
  })
}
