import request from '@/utils/request'
// get请求
// 获取商品分类
export function getCommodityTypes(params) {
  return request({
    url: '/main_store/goods/types',
    method: 'get',
    params
  })
}
// 根据商品分类获取商品属性名
export function getPropertiesKey(params, path) {
  return request({
    url: '/main_store/goods/types/properties/keys/' + path,
    method: 'get',
    params
  })
}
//
export function getPropertiesAll(params) {
  return request({
    url: '/main_store/goods/types/properties',
    method: 'get',
    params
  })
}

// put 请求
// 修改商品分类
export function putCommodityTypes(data) {
  return request({
    url: '/main_store/goods/types',
    method: 'put',
    data
  })
}
// 修改商品属性名

export function putPropertiesKey(data) {
  return request({
    url: '/main_store/goods/types/properties/keys',
    method: 'put',
    data
  })
}
// 修改商品属性值

export function putPropertiesValue(data) {
  return request({
    url: '/main_store/goods/types/properties/values',
    method: 'put',
    data
  })
}

// post 请求
// 添加商品分类
export function postCommodityTypes(data) {
  return request({
    url: '/main_store/goods/types',
    method: 'post',
    data
  })
}
// 添加商品属性名
export function postPropertiesKey(data) {
  return request({
    url: '/main_store/goods/types/properties/keys',
    method: 'post',
    data
  })
}
// 添加商品属性值
export function postPropertiesValue(data) {
  return request({
    url: '/main_store/goods/types/properties/values',
    method: 'post',
    data
  })
}

// delete请求
// 删除商品分类
export function delCommodityTypes(params) {
  return request({
    url: '/main_store/goods/types',
    method: 'delete',
    params
  })
}

// 删除商品属性名
export function delPropertiesKey(params) {
  return request({
    url: '/main_store/goods/types/properties/keys',
    method: 'delete',
    params
  })
}

// 删除商品属性值
export function delPropertiesValue(params) {
  return request({
    url: '/main_store/goods/types/properties/values',
    method: 'delete',
    params
  })
}
