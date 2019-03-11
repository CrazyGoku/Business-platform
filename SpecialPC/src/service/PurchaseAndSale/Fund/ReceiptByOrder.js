import request from '@/utils/request'
// get请求
export function getFundIn(params) {
  return request({
    url: '/main_store/fund/in',
    method: 'get',
    params
  })
}

