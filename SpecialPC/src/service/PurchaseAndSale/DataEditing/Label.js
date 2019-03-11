import request from '@/utils/request'
// get请求
export function getGoodsLabels(params) {
  return request({
    url: '/main_store/goods/labels',
    method: 'get',
    params
  })
}
export function getGoodsLabelsById(params,path) {
  return request({
    url: '/main_store/goods/labels/'+path,
    method: 'get',
    params
  })
}

// post 请求

export function postGoodsLabels(data) {
  return request({
    url: '/main_store/goods/labels',
    method: 'post',
    data
  })
}
// put 请求
export function putGoodsLabels(data) {
  return request({
    url: '/main_store/goods/labels',
    method: 'put',
    data
  })
}
// delete请求
export function delGoodsLabels(params) {
  return request({
    url: '/main_store/goods/labels',
    method: 'delete',
    params
  })
}

