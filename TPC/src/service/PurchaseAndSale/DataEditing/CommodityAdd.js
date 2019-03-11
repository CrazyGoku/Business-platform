import request from '@/utils/request'
// get请求
export function getCommodityData(params) {
  return request({
    url: '/pps/goods',
    method: 'get',
    params
  })
}
// 获取标签
export function getLabels(params) {
  return request({
    url: '/pps/goods/labels',
    method: 'get',
    params
  })
}
// 获取商品分类
export function getCommodityTypeData(params) {
  return request({
    url: '/pps/goods/types',
    method: 'get',
    params
  })
}
// 获取商品属性名
export function getProperties(params) {
  return request({
    url: '/pps/goods/types/properties',
    method: 'get',
    params
  })
}
// post请求

export function postCommodityData(data) {
  return request({
    url: '/pps/goods',
    method: 'post',
    data
  })
}

export function postGoodsImport(data, params) {
  return request({
    url: '/pps/goods/import',
    method: 'post',
    data,
    params
  })
}

// delete请求
export function delCommodityTypeData(params, path) {
  return request({
    url: '/pps/goods/types/' + path,
    method: 'delete',
    params
  })
}
export function putCommodityData(data) {
  return request({
    url: '/pps/goods',
    method: 'put',
    data
  })
}
